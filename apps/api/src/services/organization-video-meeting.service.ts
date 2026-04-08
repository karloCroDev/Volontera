import {
  CreateAttendeeCommand,
  CreateMeetingCommand,
  DeleteAttendeeCommand,
  DeleteMeetingCommand,
  Attendee,
  Meeting,
} from "@aws-sdk/client-chime-sdk-meetings";
import {
  Organization,
  OrganizationMemberRole,
  prisma,
  User,
} from "@repo/database";
import { randomUUID } from "crypto";

import { chimeClient } from "@/lib/config/aws";
import { initalizeRedisClient } from "@/lib/config/redis";
import { serverFetchOutput } from "@/lib/utils/service-output";

import { io } from "@/ws/socket";

type VideoMeetingParticipant = {
  userId: User["id"];
  attendeeId: string;
  firstName: User["firstName"];
  lastName: User["lastName"];
  image: User["image"];
  role: OrganizationMemberRole;
  isHost: boolean;
};

type StoredOrganizationVideoMeeting = {
  organizationId: string;
  hostUserId: string;
  meeting: Meeting;
  participants: VideoMeetingParticipant[];
  createdAt: string;
  updatedAt: string;
};

type MeetingParticipantProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  image: string | null;
  role: OrganizationMemberRole;
};

const MEETING_TTL_SECONDS = 60 * 60 * 1; // 1 sat TTL na sastanak u Redis pohrani, nakon čega se smatra neaktivnim i briše iz pohrane automatski

const getMeetingKey = (organizationId: string) =>
  `organization-video-meeting:${organizationId}`;

const getMeetingRoom = (organizationId: string) =>
  `organization:${organizationId}:video-meeting`;

const getParticipantProfile = async (
  organizationId: string,
  userId: string,
): Promise<MeetingParticipantProfile | null> => {
  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!member) {
    return null;
  }

  return {
    userId,
    firstName: member.user.firstName,
    lastName: member.user.lastName,
    image: member.user.image,
    role: member.role,
  };
};

const buildParticipant = ({
  profile,
  attendee,
  isHost,
}: {
  profile: MeetingParticipantProfile;
  attendee: Attendee;
  isHost: boolean;
}): VideoMeetingParticipant => ({
  // fallback na userId stiti nas od edge case-a kad aws ne vrati attendee id.
  userId: profile.userId,
  attendeeId: attendee.AttendeeId || profile.userId,
  firstName: profile.firstName,
  lastName: profile.lastName,
  image: profile.image,
  role: profile.role,
  isHost,
});

// Čitamo aktivni sastanak iz Redisa kako bismo brzo vratili trenutno stanje svim klijentima
const readStoredMeeting = async (organizationId: string) => {
  const redis = await initalizeRedisClient();
  const rawMeeting = await redis.get(getMeetingKey(organizationId));

  if (!rawMeeting) {
    return null;
  }

  return JSON.parse(rawMeeting) as StoredOrganizationVideoMeeting;
};

// Spremamo stanje sastanka u Redis i obnavljamo TTL kako aktivan sastanak ne bi prerano istekao
const saveStoredMeeting = async (meeting: StoredOrganizationVideoMeeting) => {
  const redis = await initalizeRedisClient();

  await redis.set(
    getMeetingKey(meeting.organizationId),
    JSON.stringify(meeting),
    {
      EX: MEETING_TTL_SECONDS,
    },
  );
};

const deleteStoredMeeting = async (organizationId: string) => {
  const redis = await initalizeRedisClient();
  await redis.del(getMeetingKey(organizationId));
};

const emitMeetingUpdate = async (
  organizationId: string,
  meeting: StoredOrganizationVideoMeeting | null,
) => {
  io.to(getMeetingRoom(organizationId)).emit(
    "organization-video-meeting:update",
    {
      organizationId,
      meeting,
      isActive: !!meeting,
    },
  );
};

// Dohvaćamo trenutno stanje video sastanka organizacije iz redis pohrane
export async function getOrganizationVideoMeetingState(
  organizationId: Organization["id"],
) {
  const meeting = await readStoredMeeting(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Video meeting state retrieved successfully",
    data: {
      organizationId,
      isActive: !!meeting,
      meeting,
    },
  });
}

// Pokrećemo novi video sastanak ili vraćamo pristup postojećem sastanku uz izradu attendee zapisa za korisnika
export async function startOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  const existingMeeting = await readStoredMeeting(organizationId);

  if (existingMeeting) {
    const profile = await getParticipantProfile(organizationId, userId);

    if (!profile) {
      return serverFetchOutput({
        status: 400,
        success: false,
        message: "Organization member not found",
      });
    }

    const attendeeResult = await chimeClient.send(
      new CreateAttendeeCommand({
        MeetingId: existingMeeting.meeting.MeetingId!,
        ExternalUserId: userId,
      }),
    );

    if (!attendeeResult.Attendee) {
      return serverFetchOutput({
        status: 500,
        success: false,
        message: "Unable to create meeting attendee",
      });
    }

    const updatedParticipants = existingMeeting.participants.filter(
      (entry) => entry.userId !== userId,
    );

    const updatedMeeting: StoredOrganizationVideoMeeting = {
      ...existingMeeting,
      participants: [
        ...updatedParticipants,
        buildParticipant({
          profile,
          attendee: attendeeResult.Attendee,
          isHost: existingMeeting.hostUserId === userId,
        }),
      ].sort((left, right) => Number(right.isHost) - Number(left.isHost)),
      updatedAt: new Date().toISOString(),
    };

    await saveStoredMeeting(updatedMeeting);
    await emitMeetingUpdate(organizationId, updatedMeeting);

    return serverFetchOutput({
      status: 200,
      success: true,
      message: "Video meeting started successfully",
      data: {
        organizationId,
        isActive: true,
        meeting: updatedMeeting,
        participant: updatedMeeting.participants.find(
          (entry) => entry.userId === userId,
        )!,
        meetingResponse: { Meeting: existingMeeting.meeting },
        attendeeResponse: attendeeResult,
      },
    });
  }

  const profile = await getParticipantProfile(organizationId, userId);

  if (!profile) {
    return serverFetchOutput({
      status: 400,
      success: false,
      message: "Organization member not found",
    });
  }

  const meetingResult = await chimeClient.send(
    new CreateMeetingCommand({
      ClientRequestToken: randomUUID(),
      ExternalMeetingId: organizationId,
      MediaRegion:
        process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
    }),
  );

  if (!meetingResult.Meeting) {
    return serverFetchOutput({
      status: 500,
      success: false,
      message: "Unable to create video meeting",
    });
  }

  const attendeeResult = await chimeClient.send(
    new CreateAttendeeCommand({
      MeetingId: meetingResult.Meeting.MeetingId!,
      ExternalUserId: userId,
    }),
  );

  if (!attendeeResult.Attendee) {
    return serverFetchOutput({
      status: 500,
      success: false,
      message: "Unable to create meeting attendee",
    });
  }

  const meeting: StoredOrganizationVideoMeeting = {
    organizationId,
    hostUserId: userId,
    meeting: meetingResult.Meeting,
    participants: [
      buildParticipant({
        profile,
        attendee: attendeeResult.Attendee,
        isHost: true,
      }),
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveStoredMeeting(meeting);
  await emitMeetingUpdate(organizationId, meeting);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Video meeting started successfully",
    data: {
      organizationId,
      isActive: true,
      meeting,
      participant: meeting.participants[0],
      meetingResponse: meetingResult,
      attendeeResponse: attendeeResult,
    },
  });
}

// Pridružujemo korisnika aktivnom video sastanku i ažuriramo popis sudionika
export async function joinOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return serverFetchOutput({
      status: 400,
      success: false,
      message: "No active meeting found",
    });
  }

  const profile = await getParticipantProfile(organizationId, userId);

  if (!profile) {
    return serverFetchOutput({
      status: 400,
      success: false,
      message: "Organization member not found",
    });
  }

  const attendeeResult = await chimeClient.send(
    new CreateAttendeeCommand({
      MeetingId: meeting.meeting.MeetingId!,
      ExternalUserId: userId,
    }),
  );

  if (!attendeeResult.Attendee) {
    return serverFetchOutput({
      status: 500,
      success: false,
      message: "Unable to join the meeting",
    });
  }

  const filteredParticipants = meeting.participants.filter(
    (participant) => participant.userId !== userId,
  );

  const updatedMeeting: StoredOrganizationVideoMeeting = {
    ...meeting,
    participants: [
      ...filteredParticipants,
      buildParticipant({
        profile,
        attendee: attendeeResult.Attendee,
        isHost: meeting.hostUserId === userId,
      }),
    ].sort((left, right) => Number(right.isHost) - Number(left.isHost)),
    updatedAt: new Date().toISOString(),
  };

  await saveStoredMeeting(updatedMeeting);
  await emitMeetingUpdate(organizationId, updatedMeeting);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Joined video meeting successfully",
    data: {
      organizationId,
      isActive: true,
      meeting: updatedMeeting,
      participant: updatedMeeting.participants.find(
        (participant) => participant.userId === userId,
      )!,
      meetingResponse: { Meeting: meeting.meeting },
      attendeeResponse: attendeeResult,
    },
  });
}

// Uklanjamo korisnika iz video sastanka, a izlazak domaćina završava sastanak za sve sudionike
export async function leaveOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return serverFetchOutput({
      status: 200,
      success: true,
      message: "No active meeting found",
      data: {
        organizationId,
        isActive: false,
        ended: false,
        meeting: null,
      },
    });
  }

  const currentParticipant = meeting.participants.find(
    (participant) => participant.userId === userId,
  );

  if (!currentParticipant) {
    return serverFetchOutput({
      status: 200,
      success: true,
      message: "Left video meeting successfully",
      data: {
        organizationId,
        isActive: true,
        ended: false,
        meeting,
      },
    });
  }

  if (currentParticipant.isHost || meeting.hostUserId === userId) {
    await chimeClient.send(
      new DeleteMeetingCommand({
        MeetingId: meeting.meeting.MeetingId!,
      }),
    );

    await deleteStoredMeeting(organizationId);
    await emitMeetingUpdate(organizationId, null);
    io.to(getMeetingRoom(organizationId)).emit(
      "organization-video-meeting:ended",
      {
        organizationId,
      },
    );

    return serverFetchOutput({
      status: 200,
      success: true,
      message: "Video meeting ended successfully",
      data: {
        organizationId,
        isActive: false,
        ended: true,
        meeting: null,
      },
    });
  }

  if (currentParticipant.attendeeId) {
    await chimeClient.send(
      new DeleteAttendeeCommand({
        MeetingId: meeting.meeting.MeetingId!,
        AttendeeId: currentParticipant.attendeeId,
      }),
    );
  }

  const updatedMeeting: StoredOrganizationVideoMeeting = {
    ...meeting,
    participants: meeting.participants.filter(
      (participant) => participant.userId !== userId,
    ),
    updatedAt: new Date().toISOString(),
  };

  await saveStoredMeeting(updatedMeeting);
  await emitMeetingUpdate(organizationId, updatedMeeting);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Left video meeting successfully",
    data: {
      organizationId,
      isActive: true,
      ended: false,
      meeting: updatedMeeting,
    },
  });
}

// Administrativno završavamo aktivni video sastanak i čistimo stanje sastanka iz rdisa
export async function endOrganizationVideoMeeting({
  organizationId,
}: {
  organizationId: Organization["id"];
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return serverFetchOutput({
      status: 200,
      success: true,
      message: "No active meeting found",
      data: {
        organizationId,
        ended: false,
      },
    });
  }

  await chimeClient.send(
    new DeleteMeetingCommand({
      MeetingId: meeting.meeting.MeetingId!,
    }),
  );

  await deleteStoredMeeting(organizationId);
  await emitMeetingUpdate(organizationId, null);
  io.to(getMeetingRoom(organizationId)).emit(
    "organization-video-meeting:ended",
    { organizationId },
  );

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Video meeting ended successfully",
    data: {
      organizationId,
      ended: true,
    },
  });
}

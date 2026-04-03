import {
  CreateAttendeeCommand,
  CreateMeetingCommand,
  DeleteAttendeeCommand,
  DeleteMeetingCommand,
  type Attendee,
  type Meeting,
} from "@aws-sdk/client-chime-sdk-meetings";
import { OrganizationMemberRole, prisma } from "@repo/database";
import { randomUUID } from "crypto";

import { chimeClient } from "@/lib/config/chime";
import { initalizeRedisClient } from "@/lib/config/redis";
import { io } from "@/ws/socket";

type VideoMeetingParticipant = {
  userId: string;
  attendeeId: string;
  firstName: string;
  lastName: string;
  image: string | null;
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

const MEETING_TTL_SECONDS = 60 * 60 * 8;

const getMeetingKey = (organizationId: string) =>
  `organization-video-meeting:${organizationId}`;

const getMeetingRoom = (organizationId: string) =>
  `organization:${organizationId}:video-meeting`;

const getRedisClient = async () => {
  return await initalizeRedisClient();
};

const getParticipantProfile = async (
  organizationId: string,
  userId: string,
): Promise<MeetingParticipantProfile> => {
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
    throw new Error("Organization member not found");
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
  userId: profile.userId,
  attendeeId: attendee.AttendeeId || profile.userId,
  firstName: profile.firstName,
  lastName: profile.lastName,
  image: profile.image,
  role: profile.role,
  isHost,
});

const readStoredMeeting = async (organizationId: string) => {
  const redis = await getRedisClient();
  const rawMeeting = await redis.get(getMeetingKey(organizationId));

  if (!rawMeeting) {
    return null;
  }

  return JSON.parse(rawMeeting) as StoredOrganizationVideoMeeting;
};

const saveStoredMeeting = async (meeting: StoredOrganizationVideoMeeting) => {
  const redis = await getRedisClient();

  await redis.set(
    getMeetingKey(meeting.organizationId),
    JSON.stringify(meeting),
    {
      EX: MEETING_TTL_SECONDS,
    },
  );
};

const deleteStoredMeeting = async (organizationId: string) => {
  const redis = await getRedisClient();
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

export async function getOrganizationVideoMeetingState(organizationId: string) {
  const meeting = await readStoredMeeting(organizationId);

  return {
    organizationId,
    isActive: !!meeting,
    meeting,
  };
}

export async function startOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  const existingMeeting = await readStoredMeeting(organizationId);

  if (existingMeeting) {
    const profile = await getParticipantProfile(organizationId, userId);
    const attendeeResult = await chimeClient.send(
      new CreateAttendeeCommand({
        MeetingId: existingMeeting.meeting.MeetingId!,
        ExternalUserId: userId,
      }),
    );

    if (!attendeeResult.Attendee) {
      throw new Error("Unable to create meeting attendee");
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

    return {
      organizationId,
      isActive: true,
      meeting: updatedMeeting,
      participant: updatedMeeting.participants.find(
        (entry) => entry.userId === userId,
      )!,
      meetingResponse: { Meeting: existingMeeting.meeting },
      attendeeResponse: attendeeResult,
    };
  }

  const profile = await getParticipantProfile(organizationId, userId);

  const meetingResult = await chimeClient.send(
    new CreateMeetingCommand({
      ClientRequestToken: randomUUID(),
      ExternalMeetingId: organizationId,
      MediaRegion:
        process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1",
    }),
  );

  if (!meetingResult.Meeting) {
    throw new Error("Unable to create video meeting");
  }

  const attendeeResult = await chimeClient.send(
    new CreateAttendeeCommand({
      MeetingId: meetingResult.Meeting.MeetingId!,
      ExternalUserId: userId,
    }),
  );

  if (!attendeeResult.Attendee) {
    throw new Error("Unable to create meeting attendee");
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

  return {
    organizationId,
    isActive: true,
    meeting,
    participant: meeting.participants[0],
    meetingResponse: meetingResult,
    attendeeResponse: attendeeResult,
  };
}

export async function joinOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return null;
  }

  const profile = await getParticipantProfile(organizationId, userId);

  const attendeeResult = await chimeClient.send(
    new CreateAttendeeCommand({
      MeetingId: meeting.meeting.MeetingId!,
      ExternalUserId: userId,
    }),
  );

  if (!attendeeResult.Attendee) {
    throw new Error("Unable to join the meeting");
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

  return {
    organizationId,
    isActive: true,
    meeting: updatedMeeting,
    participant: updatedMeeting.participants.find(
      (participant) => participant.userId === userId,
    )!,
    meetingResponse: { Meeting: meeting.meeting },
    attendeeResponse: attendeeResult,
  };
}

export async function leaveOrganizationVideoMeeting({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return {
      organizationId,
      isActive: false,
      ended: false,
      meeting: null,
    };
  }

  const currentParticipant = meeting.participants.find(
    (participant) => participant.userId === userId,
  );

  if (!currentParticipant) {
    return {
      organizationId,
      isActive: true,
      ended: false,
      meeting,
    };
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

    return {
      organizationId,
      isActive: false,
      ended: true,
      meeting: null,
    };
  }

  if (currentParticipant.attendeeId) {
    try {
      await chimeClient.send(
        new DeleteAttendeeCommand({
          MeetingId: meeting.meeting.MeetingId!,
          AttendeeId: currentParticipant.attendeeId,
        }),
      );
    } catch {
      // Removing a stale attendee should not block the user from leaving.
    }
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

  return {
    organizationId,
    isActive: true,
    ended: false,
    meeting: updatedMeeting,
  };
}

export async function endOrganizationVideoMeeting({
  organizationId,
}: {
  organizationId: string;
}) {
  const meeting = await readStoredMeeting(organizationId);

  if (!meeting) {
    return {
      organizationId,
      ended: false,
    };
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

  return {
    organizationId,
    ended: true,
  };
}

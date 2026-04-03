// Database
import { UserRole } from "@repo/database";

// TODO: Karlo ako budem mogao prebaciti ove typove na neko centraliziranije mjesto tj. da mogu dobiti direktno od AWS SDK-a, a ne da moram prebacivati!
export type OrganizationVideoMeetingRole = UserRole;
export type ChimeMeetingResponse = {
  Meeting?: {
    MeetingId?: string;
    MediaPlacement?: {
      AudioHostUrl?: string;
      AudioFallbackUrl?: string;
      SignalingUrl?: string;
      TurnControlUrl?: string;
      ScreenDataUrl?: string;
      ScreenSharingUrl?: string;
      ScreenViewingUrl?: string;
    };
    MediaRegion?: string;
  };
};

export type ChimeAttendeeResponse = {
  Attendee?: {
    AttendeeId?: string;
    JoinToken?: string;
    ExternalUserId?: string;
  };
};

export type OrganizationVideoMeetingParticipant = {
  userId: string;
  attendeeId: string;
  firstName: string;
  lastName: string;
  image: string | null;
  role: OrganizationVideoMeetingRole;
  isHost: boolean;
};

export type OrganizationVideoMeetingState = {
  organizationId: string;
  isActive: boolean;
  meeting: {
    organizationId: string;
    hostUserId: string;
    meeting: ChimeMeetingResponse["Meeting"];
    participants: OrganizationVideoMeetingParticipant[];
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OrganizationVideoMeetingJoinResponse =
  OrganizationVideoMeetingState & {
    isActive: boolean;
    participant: OrganizationVideoMeetingParticipant;
    meetingResponse: ChimeMeetingResponse;
    attendeeResponse: ChimeAttendeeResponse;
  };

export type OrganizationVideoMeetingLeaveResponse =
  OrganizationVideoMeetingState & {
    isActive: boolean;
    ended: boolean;
  };

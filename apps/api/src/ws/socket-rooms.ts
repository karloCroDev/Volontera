// Lib
import { sortPairKey } from "@/lib/utils/pair-key";

export const getDirectMessagesRoom = ({
  senderId,
  recieverId,
}: {
  senderId: string;
  recieverId: string;
}) => {
  const pairKey = sortPairKey({ senderId, recieverId });
  return `direct-messages:${pairKey}`;
};

export const getOrganizationGroupChatRoom = (organizationId: string) => {
  return `organization:${organizationId}`;
};

export const getOrganizationVideoMeetingRoom = (organizationId: string) => {
  return `organization:${organizationId}:video-meeting`;
};

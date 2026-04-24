import { Socket } from "socket.io";
import {
  getOrganizationGroupChatRoom,
  getOrganizationVideoMeetingRoom,
} from "@/ws/socket-rooms";

export const registerOrganizationSocketEvents = (socket: Socket) => {
  socket.on("organization-group-chat-room", (organizationId: string) => {
    const prevOrganizationId = socket.data.organizationId as string | undefined;

    if (prevOrganizationId && prevOrganizationId !== organizationId) {
      socket.leave(getOrganizationGroupChatRoom(prevOrganizationId));
    }

    socket.data.organizationId = organizationId;
    socket.join(getOrganizationGroupChatRoom(organizationId));
  });

  socket.on("organization-video-meeting-room", (organizationId: string) => {
    const prevOrganizationId = socket.data.videoMeetingOrganizationId as
      | string
      | undefined;

    if (prevOrganizationId && prevOrganizationId !== organizationId) {
      socket.leave(getOrganizationVideoMeetingRoom(prevOrganizationId));
    }

    socket.data.videoMeetingOrganizationId = organizationId;
    socket.join(getOrganizationVideoMeetingRoom(organizationId));
  });

  socket.on("organization-group-chat-room:leave", (organizationId: string) => {
    socket.leave(getOrganizationGroupChatRoom(organizationId));
    if (socket.data.organizationId === organizationId) {
      delete socket.data.organizationId;
    }
  });

  socket.on(
    "organization-video-meeting-room:leave",
    (organizationId: string) => {
      socket.leave(getOrganizationVideoMeetingRoom(organizationId));
      if (socket.data.videoMeetingOrganizationId === organizationId) {
        delete socket.data.videoMeetingOrganizationId;
      }
    },
  );
};

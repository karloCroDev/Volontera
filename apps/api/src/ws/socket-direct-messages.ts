import { Server, Socket } from "socket.io";
import { getDirectMessagesRoom } from "@/ws/socket-rooms";

export const registerDirectMessagesSocketEvents = ({
  socket,
  userId,
}: {
  socket: Socket;
  userId?: string;
}) => {
  socket.on("direct-messages-conversation-room", (participantId: string) => {
    if (!userId || !participantId) return;

    const roomName = getDirectMessagesRoom({
      senderId: userId,
      recieverId: participantId,
    });

    const previousRoom = socket.data.directMessagesRoom as string | undefined;
    if (previousRoom && previousRoom !== roomName) {
      socket.leave(previousRoom);
    }

    socket.data.directMessagesRoom = roomName;
    socket.join(roomName);
  });

  socket.on(
    "direct-messages-conversation-room:leave",
    (participantId?: string) => {
      const roomName = participantId
        ? userId
          ? getDirectMessagesRoom({
              senderId: userId,
              recieverId: participantId,
            })
          : undefined
        : ((socket.data.directMessagesRoom as string | undefined) ?? undefined);

      if (!roomName) return;

      socket.leave(roomName);
      if (socket.data.directMessagesRoom === roomName) {
        delete socket.data.directMessagesRoom;
      }
    },
  );
};

export const areUsersInSameDirectMessagesRoom = ({
  io,
  firstUserId,
  secondUserId,
}: {
  io: Server;
  firstUserId: string;
  secondUserId: string;
}) => {
  const roomName = getDirectMessagesRoom({
    senderId: firstUserId,
    recieverId: secondUserId,
  });
  const socketsInRoom = io.sockets.adapter.rooms.get(roomName);

  if (!socketsInRoom) return false;

  let hasFirstUser = false;
  let hasSecondUser = false;

  for (const socketId of socketsInRoom) {
    const roomSocket = io.sockets.sockets.get(socketId);
    const roomUserId = roomSocket?.data.userId as string | undefined;

    if (!roomUserId) continue;

    if (roomUserId === firstUserId) hasFirstUser = true;
    if (roomUserId === secondUserId) hasSecondUser = true;

    if (hasFirstUser && hasSecondUser) return true;
  }

  return false;
};

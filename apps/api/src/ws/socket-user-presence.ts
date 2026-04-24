import { Socket } from "socket.io";

const userSocketObj: Record<string, string> = {}; // {userId: socketId}

export const registerConnectedUser = ({
  socket,
  userId,
}: {
  socket: Socket;
  userId?: string;
}) => {
  if (!userId) return;

  userSocketObj[userId] = socket.id;
  socket.data.userId = userId;
};

export const unregisterDisconnectedUser = (userId?: string) => {
  if (!userId) return;
  delete userSocketObj[userId];
};

export const getOnlineUsers = () => Object.keys(userSocketObj);

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketObj[receiverId];
};

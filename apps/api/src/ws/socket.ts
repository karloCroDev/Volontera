// External packages
import http from "http";
import express from "express";
import { Server } from "socket.io";
import {
  areUsersInSameDirectMessagesRoom as areUsersInSameDirectMessagesRoomHelper,
  registerDirectMessagesSocketEvents,
} from "@/ws/socket-direct-messages";
import { registerOrganizationSocketEvents } from "@/ws/socket-organization";
import {
  getOnlineUsers,
  getReceiverSocketId as getReceiverSocketIdHelper,
  registerConnectedUser,
  unregisterDisconnectedUser,
} from "@/ws/socket-user-presence";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [process.env.WEB_URL!],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId: string) => {
  return getReceiverSocketIdHelper(receiverId);
};

export const areUsersInSameDirectMessagesRoom = ({
  firstUserId,
  secondUserId,
}: {
  firstUserId: string;
  secondUserId: string;
}) => {
  return areUsersInSameDirectMessagesRoomHelper({
    io,
    firstUserId,
    secondUserId,
  });
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string | undefined;

  registerConnectedUser({ socket, userId });

  // Emit => Šalje podatke svim klijentima
  io.emit("get-online-users", getOnlineUsers());

  registerOrganizationSocketEvents(socket);
  registerDirectMessagesSocketEvents({ socket, userId });

  // Handelam samo kada se korisnik disconnecta, jer npr.
  socket.on("disconnect", () => {
    unregisterDisconnectedUser(userId);

    // Once the user leaves then send the data once again
    io.emit("get-online-users", getOnlineUsers());
  });
});

// External packages
import http from "http";
import express from "express";
import { Server } from "socket.io";

// Types
import { EmitUsers } from "@repo/types/sockets";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [process.env.WEB_URL!],
    methods: ["GET", "POST"],
  },
});

const userSocketObj: Record<string, string> = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketObj[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) userSocketObj[userId] = socket.id;

  // Emit => Šalje podatke svim klijentima
  io.emit<EmitUsers>("get-online-users", Object.keys(userSocketObj));

  // On sluša događaje sve od klijenata
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketObj[userId];

    // Once the user leaves then send the data once again
    io.emit("get-online-users", Object.keys(userSocketObj));
  });
});

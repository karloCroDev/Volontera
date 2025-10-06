import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
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

  // Emit send data to all connected clients
  io.emit("get-online-users", Object.keys(userSocketObj));

  // On is listening to all events
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketObj[userId];
    // Once the user leaves then send the data once again
    io.emit("get-online-users", Object.keys(userSocketObj));
  });
});

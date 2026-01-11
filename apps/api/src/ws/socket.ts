// External packages
import http from "http";
import express from "express";
import { Server } from "socket.io";

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
  io.emit("get-online-users", Object.keys(userSocketObj));

  socket.on("organization-group-chat-room", (organizationId: string) => {
    socket.join(`organization:${organizationId}`);
  }); // Ne diconnectam jer automatski se diconnecta kada napusti stranicu tj. route za group chat neke organizacije

  // Handelam samo kada se korisnik disconnecta, jer npr.
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketObj[userId];

    // Once the user leaves then send the data once again
    io.emit("get-online-users", Object.keys(userSocketObj));
  });
});

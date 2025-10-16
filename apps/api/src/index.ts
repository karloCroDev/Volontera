// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { authRoutes } from "@/routes/authRoutes";

// Middleware
import { authMiddleware } from "@/middleware/authMiddleware";
import { adminMiddleware } from "@/middleware/organizationMiddleware";

// Config
import { server, app } from "@/config/socket";
import { oAuthGoogle } from "@/config/oAuth-google";

// Routes
import { paymentRoutes } from "@/routes/paymentRoutes";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/payment", paymentRoutes); // Staviu uvik povise express.json

app.use(oAuthGoogle.initialize());

app.use(express.json());
app.use("/auth", authRoutes);

// Test
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "This is a ADMIN protected route" });
});

server.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});

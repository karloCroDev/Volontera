// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Middleware
import { authMiddleware } from "@/middleware/auth-middleware";
import {
  hasRoleMiddleware,
  organizationMiddleware,
} from "@/middleware/role-middleware";
import { onboardingProcessMiddleware } from "@/middleware/onbaording-middleware";
import { userMiddleware } from "@/middleware/role-middleware";

// Lib
import { app } from "@/ws/socket";
import { oAuthGoogleHandle } from "@/config/oAuth-google";

// Routes
import { authRoutes } from "@/routes/auth.routes";
import { directMessagesRoutes } from "@/routes/direct-messages.routes";
import { userRoutes } from "@/routes/user.routes";
// import { paymentRoutes } from "@/routes/payment-routes";
import { onboardingRoutes } from "@/routes/onboarding.routes";
import { settingsRoutes } from "@/routes/settings.routes";
import { helpRoutes } from "@/routes/help.routes";
import { paymentRoutes } from "@/routes/payment.routes";
import { notificationRoutes } from "@/routes/notification.routes";
import { initalizeRedisClient } from "@/config/redis";
import { imageRoutes } from "@/routes/image.routes";
import { organizationRoutes } from "@/routes/organization.routes";

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.WEB_URL!,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(oAuthGoogleHandle.initialize());
app.use("/payment", paymentRoutes);

app.use(express.json());
app.use("/auth", authRoutes);
app.use(
  "/onboarding",
  authMiddleware,
  onboardingProcessMiddleware,
  onboardingRoutes
);
app.use("/user", authMiddleware, userRoutes);
app.use("/settings", authMiddleware, hasRoleMiddleware, settingsRoutes);
app.use("/help", authMiddleware, hasRoleMiddleware, helpRoutes);
app.use(
  "/notifications",
  authMiddleware,
  hasRoleMiddleware,
  notificationRoutes
);
app.use(
  "/direct-messages",
  authMiddleware,
  hasRoleMiddleware,
  directMessagesRoutes
);
app.use("/image", imageRoutes);
app.use(
  "/organization",
  authMiddleware,
  hasRoleMiddleware,
  organizationMiddleware,
  organizationRoutes
);

// Test
app.get("/protected-user", authMiddleware, userMiddleware, (req, res) => {
  res.json({ message: "Awesome you accessed the proteced route" });
});

app.post("/test", async (req, res) => {
  // Redis: works fine!
  const client = await initalizeRedisClient();
  console.log(client);
  res.status(200).json({ message: "Redis client initialized" });
});

app.get(
  "/protected-organization",
  authMiddleware,
  organizationMiddleware,
  (req, res) => {
    res.json({ message: "Awesome you accessed the proteced route" });
  }
);

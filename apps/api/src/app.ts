// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Middleware
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  hasRoleMiddleware,
  organizationMiddleware,
} from "@/middleware/role.middleware";
import { onboardingProcessMiddleware } from "@/middleware/onboarding.middleware";
import { userMiddleware } from "@/middleware/role.middleware";

// Lib
import { app } from "@/ws/socket";
import { oAuthGoogleHandle } from "@/config/oAuth-google";

// Routes
import { authRoutes } from "@/routes/auth.route";
import { directMessagesRoutes } from "@/routes/direct-messages.route";
import { userRoutes } from "@/routes/user.route";
// import { paymentRoutes } from "@/routes/payment-routes";
import { onboardingRoutes } from "@/routes/onboarding.route";
import { settingsRoutes } from "@/routes/settings.route";
import { helpRoutes } from "@/routes/help.route";
import { paymentRoutes } from "@/routes/payment.route";
import { notificationRoutes } from "@/routes/notification.route";
import { initalizeRedisClient } from "@/config/redis";
import { imageRoutes } from "@/routes/image.route";
import { organizationRoutes } from "@/routes/organization.route";
import { searchRoutes } from "@/routes/search.route";
import { postRoutes } from "@/routes/post.route";
import { commentRoutes } from "@/routes/comment.route";
import { organizationManagmentRoutes } from "@/routes/organization-managment.route";
import { organizationGroupChatRoute } from "@/routes/organization-group-chat.route";
import { organizationTasksRoutes } from "@/routes/organization-tasks.route";

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
app.use("/organization", authMiddleware, hasRoleMiddleware, organizationRoutes);
app.use(
  "/organization-managment",
  authMiddleware,
  hasRoleMiddleware,
  organizationManagmentRoutes
);
app.use(
  "/organization-group-chat",
  authMiddleware,
  hasRoleMiddleware,
  organizationGroupChatRoute
);
app.use(
  "/organization-tasks",
  authMiddleware,
  hasRoleMiddleware,
  organizationTasksRoutes
);
app.use("/search", authMiddleware, hasRoleMiddleware, searchRoutes);
app.use("/post", authMiddleware, hasRoleMiddleware, postRoutes);
app.use("/comment", authMiddleware, hasRoleMiddleware, commentRoutes);

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

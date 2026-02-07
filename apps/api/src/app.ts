// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Middleware
import { authMiddleware } from "@/middleware/auth.middleware";
import { hasRoleMiddleware } from "@/middleware/role.middleware";
import { onboardingProcessMiddleware } from "@/middleware/onboarding.middleware";

// Lib
import { app } from "@/ws/socket";
import { oAuthGoogleHandle } from "@/lib/config/oAuth-google";

// Routes
import { authRoutes } from "@/routes/auth.route";
import { directMessagesRoutes } from "@/routes/direct-messages.route";
import { userRoutes } from "@/routes/user.route";
import { onboardingRoutes } from "@/routes/onboarding.route";
import { settingsRoutes } from "@/routes/settings.route";
import { helpRoutes } from "@/routes/help.route";
import { paymentRoutes } from "@/routes/payment.route";
import { notificationRoutes } from "@/routes/notification.route";
import { imageRoutes } from "@/routes/image.route";
import { organizationRoutes } from "@/routes/organization.route";
import { searchRoutes } from "@/routes/search.route";
import { postRoutes } from "@/routes/post.route";
import { commentRoutes } from "@/routes/comment.route";
import { organizationManagmentRoutes } from "@/routes/organization-managment.route";
import { organizationGroupChatRoute } from "@/routes/organization-group-chat.route";
import { organizationTasksRoutes } from "@/routes/organization-tasks.route";
import { homeRoute } from "@/routes/home.route";
import { rateLimitMiddleware } from "@/middleware/rate-limit.middleware";

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.WEB_URL!,
    credentials: true,
  }),
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
  onboardingRoutes,
);
app.use("/user", userRoutes);
app.use(
  "/settings",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["settings"],
    limit: 10,
  }),
  settingsRoutes,
);
app.use(
  "/help",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["help"],
    limit: 10,
  }),
  helpRoutes,
);
app.use(
  "/notifications",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["notifications"],
    limit: 20,
  }),
  notificationRoutes,
);
app.use(
  "/direct-messages",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["direct-messages"],
    limit: 50,
  }),
  directMessagesRoutes,
);
app.use("/image", imageRoutes);
app.use(
  "/organization",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["organization"],
    limit: 35,
  }),
  organizationRoutes,
);
app.use(
  "/organization-managment",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["organization-managment"],
    limit: 35,
    expiration: 1,
  }),
  organizationManagmentRoutes,
);
app.use(
  "/organization-group-chat",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["organization-group-chat"],
    limit: 50,
  }),
  organizationGroupChatRoute,
);
app.use(
  "/organization-tasks",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["organization-tasks"],
    limit: 75,
  }),
  organizationTasksRoutes,
);
app.use(
  "/search",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["search"],
    limit: 50,
  }),
  searchRoutes,
);
app.use(
  "/post",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["post"],
    limit: 100,
  }),
  postRoutes,
);
app.use(
  "/comment",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["comment"],
    limit: 25,
  }),
  commentRoutes,
);
app.use(
  "/home",
  authMiddleware,
  hasRoleMiddleware,
  rateLimitMiddleware({
    additionalTags: ["comment"],
    limit: 20,
  }),
  homeRoute,
);

// Test
app.get(
  "/test",
  authMiddleware,
  rateLimitMiddleware({
    additionalTags: ["protected-user"],
    limit: 5,
  }),
  (req, res) => {
    res.json({ message: "Awesome you accessed the proteced route" });
  },
);

// IMPORTANT: Stop redis server (wsl)

// redis-start
// sudo service redis-server status
// sudo service redis-server stop

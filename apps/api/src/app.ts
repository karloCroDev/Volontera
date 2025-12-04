// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

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
import { authRoutes } from "@/routes/auth-routes";
// import { paymentRoutes } from "@/routes/payment-routes";
import { onboardingRoutes } from "@/routes/onboarding-routes";
import { settingsRoutes } from "@/routes/settings-routes";
import { helpRoutes } from "@/routes/help-routes";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
// app.use("/payment", paymentRoutes); // Staviu uvik povise express.json

app.use(oAuthGoogleHandle.initialize());

app.use(express.json());
app.use("/auth", authRoutes);
app.use(
  "/onboarding",
  authMiddleware,
  onboardingProcessMiddleware,
  onboardingRoutes
);
app.use("/settings", authMiddleware, hasRoleMiddleware, settingsRoutes);
app.use("/help", authMiddleware, hasRoleMiddleware, helpRoutes);

// Test
app.get("/protected-user", authMiddleware, userMiddleware, (req, res) => {
  res.json({ message: "Awesome you accessed the proteced route" });
});

app.get(
  "/protected-organization",
  authMiddleware,
  organizationMiddleware,
  (req, res) => {
    res.json({ message: "Awesome you accessed the proteced route" });
  }
);

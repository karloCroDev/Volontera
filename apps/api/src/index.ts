// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// Middleware
import { authMiddleware } from "@/middleware/authMiddleware";
import { adminMiddleware } from "@/middleware/organizationMiddleware";
import { onbaordingMiddleware } from "@/middleware/onbaordingMiddleware";

// Config
import { server, app } from "@/config/socket";
import { oAuthGoogle } from "@/config/oAuth-google";

// Routes
import { authRoutes } from "@/routes/authRoutes";
import { paymentRoutes } from "@/routes/paymentRoutes";
import { onboardingRoutes } from "@/routes/onboardingRoutes";

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
app.use("/onboarding", authMiddleware, onbaordingMiddleware, onboardingRoutes);

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

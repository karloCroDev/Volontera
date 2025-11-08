// External packages
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// Middleware
import { authMiddleware } from "@/middleware/authMiddleware";
import { organizationMiddleware } from "@/middleware/roleMiddleware";
import { onboardingProcessMiddleware } from "@/middleware/onboardingMiddleware";

// Config
import { server, app } from "@/config/socket";
import { oAuthGoogleHandle } from "@/config/oAuth-google";

// Routes
import { authRoutes } from "@/routes/authRoutes";
import { paymentRoutes } from "@/routes/paymentRoutes";
import { onboardingRoutes } from "@/routes/onboardingRoutes";
import { userMiddleware } from "@/middleware/roleMiddleware";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/payment", paymentRoutes); // Staviu uvik povise express.json

app.use(oAuthGoogleHandle.initialize());

app.use(express.json());
app.use("/auth", authRoutes);
app.use(
  "/onboarding",
  authMiddleware,
  onboardingProcessMiddleware,
  onboardingRoutes
);

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

// app.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
//   res.json({ message: "This is a ADMIN protected route" });
// });

server.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});

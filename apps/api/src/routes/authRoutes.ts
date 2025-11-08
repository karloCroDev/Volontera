// External packages
import express from "express";
import { Router } from "express";

// Contorllers
import { login } from "@/controllers/auth/login";
import { register } from "@/controllers/auth/register";
import { logout } from "@/controllers/auth/logout";
import { session } from "@/controllers/auth/session";
import { forgotPassword } from "@/controllers/auth/forgot-password";
import { resetPassword } from "@/controllers/auth/reset-password";
import {
  resetVerifyToken,
  verifyTokenOtp,
} from "@/controllers/auth/verify-token-otp";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

// Config
import { oAuthGoogle } from "@/config/oAuth-google";

export const authRoutes = Router();

authRoutes.use(express.json());

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/session", session);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/verify-token-otp", verifyTokenOtp);
authRoutes.post("/reset-verify-token", resetVerifyToken);
authRoutes.get(
  "/google",
  oAuthGoogle.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRoutes.get(
  "/google/callback",
  oAuthGoogle.authenticate("google", {
    failureRedirect: "http://localhost:3000/auth/login",
    session: false,
  }),
  (req, res) => {
    generateTokenAndSetCookie({
      res,
      role: req.user.role,
      userId: req.user.userId,
      // subscriptionTier: req.user.subscriptionTier,
      onboardingFinished: req.user.onboardingFinished,
    });

    res.redirect("http://localhost:3000/home");
  }
);

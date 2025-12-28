// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  forgetPassword,
  login,
  register,
  resetPassword,
  resetVerifyToken,
  verifyToken,
} from "@/controllers/auth.controller";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

// Lib
import { oAuthGoogleHandle } from "@/config/oAuth-google";

export const authRoutes = Router();

authRoutes.use(express.json());

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgetPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/verify-token", verifyToken);
authRoutes.post("/reset-verify-token", resetVerifyToken);

// Google OAuth sign in method
authRoutes.get(
  "/google",
  oAuthGoogleHandle.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRoutes.get(
  "/google/callback",
  oAuthGoogleHandle.authenticate("google", {
    failureRedirect: `${process.env.WEB_URL}/auth/login`,
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

    res.redirect(`${process.env.WEB_URL}/home`);
  }
);

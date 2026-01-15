// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  forgetPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  resetVerifyTokenController,
  verifyTokenController,
} from "@/controllers/auth.controller";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { oAuthGoogleHandle } from "@/config/oAuth-google";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@repo/schemas/auth";

// Middleware
import { validate } from "@/middleware/validate.middleware";

export const authRoutes = Router();

authRoutes.use(express.json());

authRoutes.post(
  "/register",
  validate({
    schema: registerSchema,
    responseOutput: "form",
  }),
  registerController
);
authRoutes.post(
  "/login",
  validate({
    schema: loginSchema,
    responseOutput: "form",
  }),
  loginController
);
authRoutes.post(
  "/forgot-password",
  validate({
    schema: loginSchema,
    responseOutput: "form",
  }),
  forgetPasswordController
);
authRoutes.post(
  "/reset-password",
  validate({
    schema: resetPasswordSchema,
    responseOutput: "form",
  }),
  resetPasswordController
);
authRoutes.post(
  "/verify-token",
  validate({
    schema: verifyEmailSchema,
    responseOutput: "form",
  }),
  verifyTokenController
);
authRoutes.post(
  "/reset-verify-token",
  validate({
    schema: verifyEmailSchema,
    responseOutput: "form",
  }),
  resetVerifyTokenController
);

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

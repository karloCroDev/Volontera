import express from "express";
import { Router } from "express";
import { login } from "@/src/controllers/auth/login";
import { register } from "@/src/controllers/auth/register";
import { logout } from "@/src/controllers/auth/logout";
import { session } from "@/src/controllers/auth/session";
import { forgotPassword } from "@/src/controllers/auth/forgot-password";
import { resetPassword } from "@/src/controllers/auth/reset-password";
import {
  resetVerifyToken,
  verifyTokenOtp,
} from "@/src/controllers/auth/verify-token-otp";
import { generateTokenAndSetCookie } from "@/src/lib/set-token-cookie";
import { oAuthGoogle } from "@/src/config/oAuth-google";

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
      role: "BASIC",
      userId: req.user.userId,
    });

    res.redirect("http://localhost:3000/chat");
  }
);

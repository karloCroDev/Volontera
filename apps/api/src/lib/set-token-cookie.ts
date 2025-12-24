// External packages
import jwt from "jsonwebtoken";
import { Response } from "express";

// Database
import { User } from "@repo/database";

export function generateTokenAndSetCookie({
  res,
  userId,
  role,
  // subscriptionTier,
  onboardingFinished,
}: {
  res: Response;
  userId: string;
  role: User["role"];
  // subscriptionTier: User["subscriptionTier"];
  onboardingFinished: User["onboardingFinished"];
}) {
  const token = jwt.sign(
    { userId, role, onboardingFinished },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log("Successfully created token");

  return token;
}

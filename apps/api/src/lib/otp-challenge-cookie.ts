// External packages
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const OTP_CHALLENGE_COOKIE_NAME = "otp_challenge";

type OtpChallengePayload = {
  email: string;
  purpose: "otp_challenge";
};

export function setOtpChallengeCookie(res: Response, email: string) {
  const token = jwt.sign(
    {
      email,
      purpose: OTP_CHALLENGE_COOKIE_NAME,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "10m",
    },
  );

  res.cookie(OTP_CHALLENGE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 10 * 60 * 1000,
  });
}

export function clearOtpChallengeCookie(res: Response) {
  res.clearCookie(OTP_CHALLENGE_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}

export function getOtpChallengeEmailFromRequest(req: Request) {
  const token = req.cookies?.[OTP_CHALLENGE_COOKIE_NAME];
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Partial<OtpChallengePayload>;

    if (payload.purpose !== OTP_CHALLENGE_COOKIE_NAME || !payload.email) {
      return null;
    }

    return payload.email;
  } catch {
    return null;
  }
}

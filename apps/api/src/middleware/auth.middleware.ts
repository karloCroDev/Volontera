// External packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Models
import { findUserById } from "@/models/user.model";
import { cacheKey, redisGetOrSetJson } from "@/lib/cache-json";
import { User } from "@repo/database";
import { success } from "zod";

export type JwtUser = {
  userId: string;
  role: User["role"];
  onboardingFinished: User["onboardingFinished"];
};

// Type deklaracija koja je globalana, omogućava pristup
declare module "express-serve-static-core" {
  interface Request {
    user: JwtUser;
  }
}

// TODO: Umjesto redis radije napraviti pomoću refresh i access token. Malo je nezgodno sa next js na serveru handleati. Pogledaj ovaj video u buducnosti: https://youtu.be/6CrZ8ue4Q_A
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(400)
      .json({ message: "Auth token missing", success: false });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser;

    const isBanned = await redisGetOrSetJson<boolean>({
      key: cacheKey(["auth", "is-banned", user.userId]),
      ttlSeconds: 15 * 60, // 15 minuta
      loader: async () => {
        const databaseUser = await findUserById(user.userId);
        return !!databaseUser?.isBanned;
      },
    });

    if (isBanned) {
      return res
        .status(400)
        .json({ success: false, isBanned, message: "User account is banned" });
    }

    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

// External packages
import { NextFunction, Request, Response } from "express";

// Lib
import { rateLimit, RateLimitArgs } from "@/lib/rate-limiting";

export function rateLimitMiddleware({
  additionalTags,
  expiration,
  limit,
}: Omit<RateLimitArgs, "userId">) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.user.userId;

    const allowed = await rateLimit({
      userId,
      additionalTags,
      expiration,
      limit,
    });

    if (!allowed) {
      return res
        .status(429)
        .json({ message: "Too many requests", success: false });
    }

    next();
  };
}

// External packages
import { type User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: string;
      role: User["role"];
      pro: User["subscriptionTier"];
    };
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.user;

  if (role !== "ADMIN") {
    return res.status(400).json({ message: "Forbidden: Admins only" });
  }

  next();
}

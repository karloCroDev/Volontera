// External packages
import { type User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export interface JwtUser {
  userId: string;
  role: User["role"];
  subscriptionTier: User["subscriptionTier"];
}

declare module "express-serve-static-core" {
  interface Request {
    user: JwtUser;
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

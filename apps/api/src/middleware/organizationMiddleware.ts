// External packages
import { type User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      userId: string;
      role: User["role"];
    };
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req;

  console.log(user);
  if (!user || user.role !== "ORGANIZATION") {
    return res.status(400).json({ message: "Forbidden: Admins only" });
  }

  next();
}

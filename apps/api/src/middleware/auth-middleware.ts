// External packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware
import { JwtUser } from "@/lib/types/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user: JwtUser;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Auth token missing" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

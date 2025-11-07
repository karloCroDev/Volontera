// External packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware
import { JwtUser } from "@/middleware/organizationMiddleware";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  let token = null;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else if (cookieToken) {
    token = cookieToken;
  }

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

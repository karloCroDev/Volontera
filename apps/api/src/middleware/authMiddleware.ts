// External packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "No Bearer token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(400).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err)
      return res.status(400).json({ message: "Invalid or expired token" });

    // @ts-ignore
    req.user = user;
    next();
  });
}

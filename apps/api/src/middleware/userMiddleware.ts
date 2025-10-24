// External packages
import { Request, Response, NextFunction } from "express";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.user;

  if (role !== "USER") {
    return res.status(400).json({ message: "Forbidden: Users only" });
  }

  next();
}

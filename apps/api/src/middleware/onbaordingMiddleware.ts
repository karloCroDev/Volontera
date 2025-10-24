// External packages
import { Request, Response, NextFunction } from "express";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "Forbidden: Users only" });
  }

  next();
}

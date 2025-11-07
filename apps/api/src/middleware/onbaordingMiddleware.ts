// External packages
import { Request, Response, NextFunction } from "express";

export function onbaordingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, role } = req.user;

  if (!userId || !!role) {
    return res
      .status(400)
      .json({ message: "Forbidden: Users without role created only" });
  }

  next();
}

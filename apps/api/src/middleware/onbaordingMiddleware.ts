// External packages
import { Request, Response, NextFunction } from "express";

export function onbaordingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.user;

  if (!!role) {
    return res
      .status(400)
      .json({ message: "Forbidden: Users without role created only" });
  }

  next();
}

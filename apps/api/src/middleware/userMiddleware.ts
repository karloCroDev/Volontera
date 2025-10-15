// External packages
import { Request, Response, NextFunction } from "express";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req;

  console.log(user);
  if (!user || user.role !== "USER") {
    return res.status(400).json({ message: "Forbidden: Users only" });
  }

  next();
}

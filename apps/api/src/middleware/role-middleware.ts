// External packages
import { Request, Response, NextFunction } from "express";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role, onboardingFinished } = req.user;

  if (role !== "USER" || !onboardingFinished) {
    return res.status(400).json({ message: "Forbidden: Users only" });
  }

  next();
}

export function organizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role, onboardingFinished } = req.user;

  console.log(role, onboardingFinished);
  if (role !== "ORGANIZATION" || !onboardingFinished) {
    return res.status(400).json({ message: "Forbidden: Organizations only" });
  }

  next();
}

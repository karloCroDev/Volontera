// External packages
import { Request, Response, NextFunction } from "express";

export function onboardingProcessMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { onboardingFinished } = req.user;

  if (onboardingFinished) {
    return res.status(400).json({
      message:
        "Forbidden: Only users who haven't created the onboarding process",
    });
  }

  next();
}

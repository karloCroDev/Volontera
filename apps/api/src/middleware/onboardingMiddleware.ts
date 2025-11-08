// External packages
import { Request, Response, NextFunction } from "express";

export function onboardingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
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

export async function additionalInformationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.user;

  if (!role) {
    return res.status(400).json({
      message:
        "Please choose application role before fulffiling additional details",
    });
  }

  next();
}

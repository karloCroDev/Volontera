// External packages
import { Request, Response, NextFunction } from "express";

// Permissons
import {
  isAdminAccount,
  isOrganizationAccount,
  isRegularUserAccount,
} from "@repo/permissons/index";

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { role, onboardingFinished } = req.user;

  if (isRegularUserAccount(role) || !onboardingFinished) {
    return res
      .status(400)
      .json({ success: false, message: "Forbidden: Users only" });
  }

  next();
}

export function organizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { role, onboardingFinished } = req.user;

  if (isOrganizationAccount(role) || !onboardingFinished) {
    return res
      .status(400)
      .json({ success: false, message: "Forbidden: Organizations only" });
  }

  next();
}
export async function superAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { role, onboardingFinished } = req.user;

  if (isAdminAccount(role) || !onboardingFinished) {
    return res
      .status(400)
      .json({ success: false, message: "Forbidden: Super Admins only" });
  }

  next();
}

export async function hasRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { role } = req.user;

  if (!role) {
    return res.status(400).json({
      success: false,
      message:
        "Please choose application role before fulffiling additional details",
    });
  }

  next();
}

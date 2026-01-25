// External packages
import { NextFunction, Request, Response } from "express";

// Lib
import { isOrganizationOwnerOnProPlan, isUserOnProPlan } from "@/lib/payment";

export async function proPlanOrganizationMiddleware(
  type: "body" | "params" | "query" = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isOwnerOnProPlan = await isOrganizationOwnerOnProPlan(req[type]);

    if (!isOwnerOnProPlan)
      return res.status(400).json({
        message:
          "Payment Required: The owner of organization needs to be on Pro plan",
        success: false,
      });

    next();
  };
}

export async function proPlanUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isUserPro = await isUserOnProPlan(req.user.userId);

  if (!isUserPro) {
    return res
      .status(400)
      .json({ message: "Payment Required: Pro plan needed", success: false });
  }

  next();
}

// External packages
import { NextFunction, Request, Response } from "express";

// Lib
import { isOrganizationOwnerOnProPlan, isUserOnProPlan } from "@/lib/payment";
import { cacheKey, redisGetOrSetJson } from "@/lib/cache-middleware";
import { Organization } from "@repo/database";

export async function proPlanOrganizationMiddleware(
  type: "body" | "params" | "query" = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req[type].organizationId as Organization["id"];
    const key = cacheKey(["pay", "org-owner-pro", organizationId]);

    const isOwnerOnProPlan = await redisGetOrSetJson<boolean>({
      key,
      ttlSeconds: 60,
      loader: async () => isOrganizationOwnerOnProPlan(organizationId),
    });

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
  const userId = req.user.userId;
  const key = cacheKey(["pay", "user-pro", userId]);
  const isUserPro = await redisGetOrSetJson<boolean>({
    key,
    ttlSeconds: 60,
    loader: async () => await isUserOnProPlan(userId),
  });
  if (!isUserPro) {
    return res
      .status(400)
      .json({ message: "Payment Required: Pro plan needed", success: false });
  }

  next();
}

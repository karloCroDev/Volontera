// External packages
import { Request, Response, NextFunction } from "express";

// Models
import { retrieveOrganizationMember } from "@/models/organization-managment.model";

// Database
import { OrganizationMemberRole } from "@repo/database";

// Lib
import { cacheKey, redisGetOrSetJson } from "@/lib/cache-json";

// Permissions
import { hasWantedOrganizationRole } from "@repo/permissons/index";

export function organizationRolesMiddleware({
  aquiredRoles,
  type = "body",
}: {
  aquiredRoles: OrganizationMemberRole[];
  type?: "body" | "query" | "params";
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;

    const organizationId = req[type].organizationId;
    const key = cacheKey(["org", "member-role", organizationId, userId]);

    const cachedMember = await redisGetOrSetJson<{
      role: OrganizationMemberRole;
    } | null>({
      key,
      ttlSeconds: 60,
      loader: async () => {
        const member = await retrieveOrganizationMember({
          organizationId,
          userId,
        });

        return member ? { role: member.role } : null;
      },
    });

    if (!cachedMember || cachedMember.role === "BANNED") {
      return res.status(400).json({
        message: "Forbidden access to this organization",
        success: false,
      });
    }

    const allowed = hasWantedOrganizationRole({
      userRole: cachedMember.role,
      requiredRoles: aquiredRoles,
    });

    if (!allowed) {
      return res.status(400).json({
        message: "Forbidden: Insufficient organization role",
        success: false,
      });
    }

    return next();
  };
}

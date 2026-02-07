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
  ownerHasAllAccess = true,
}: {
  aquiredRoles?: OrganizationMemberRole[];
  type?: "body" | "query" | "params";
  ownerHasAllAccess?: boolean;
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

    if (!cachedMember) {
      return res.status(400).json({
        message: "Forbidden: Not a member of the organization",
        success: false,
      });
    }

    const allowed = hasWantedOrganizationRole({
      userRole: cachedMember.role,
      requiredRoles:
        aquiredRoles && aquiredRoles.length > 0
          ? aquiredRoles
          : [OrganizationMemberRole.OWNER],
      ownerHasAllAccess,
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

// External packages
import { Request, Response, NextFunction } from "express";

// Models
import { retrieveOrganizationMember } from "@/models/organization-managment.model";

// Database
import { Organization, OrganizationMember } from "@repo/database";
import { cacheKey, redisGetOrSetJson } from "@/lib/cache-middleware";

export function organizationRolesMiddleware({
  aquiredRoles,
  type = "body",
}: {
  aquiredRoles?: OrganizationMember["role"][];
  type?: "body" | "query" | "params";
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;

    const organizationId = req[type].organizationId;
    const key = cacheKey(["org", "member-role", organizationId, userId]);

    const cachedMember = await redisGetOrSetJson<{
      role: OrganizationMember["role"];
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

    // Owner uvijek ima pristup svemu unutar organizacije (osim ako je eksplicitno zabranjeno)
    if (cachedMember.role === "OWNER") return next();

    // Ako nisu specificirane role onda ne moze nijedan korisnik osim organizacije pristupiti
    if (!aquiredRoles) {
      return res.status(400).json({
        message: "Bad Request: No roles specified for access",
        success: false,
      });
    }

    if (!aquiredRoles.includes(cachedMember.role)) {
      return res.status(400).json({
        message: "Forbidden: Insufficient organization role",
        success: false,
      });
    }

    return next();
  };
}

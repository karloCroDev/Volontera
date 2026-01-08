// External packages
import { Request, Response, NextFunction } from "express";

// Models
import { retrieveOrganizationMember } from "@/models/organization-managment.model";

// Database
import { Organization, OrganizationMember } from "@repo/database";

export async function organizationRolesMiddleware(
  aquiredRoles: OrganizationMember["role"][]
) {
  // TODO: Redis will be sigma sigma and cache this!!
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;
    const member = await retrieveOrganizationMember({
      organizationId: req.params.organizationId as Organization["id"],
      userId: userId,
    });

    if (!member) {
      return res.status(400).json({
        message: "Forbidden: Not a member of the organization",
        success: false,
      });
    }

    if (member.role === "OWNER") {
      return next();
    }

    if (!aquiredRoles.includes(member.role)) {
      return res.status(400).json({
        message: "Forbidden: Insufficient organization role",
        success: false,
      });
    }

    return next();
  };
}

// External packages
import { Request, Response, NextFunction } from "express";

// Models
import { retrieveOrganizationMember } from "@/models/organization-managment.model";

// Database
import { Organization, OrganizationMember } from "@repo/database";

export function organizationRolesMiddleware(
  aquiredRoles?: OrganizationMember["role"][]
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

    // Owner uvijek ima pristup svemu unutar organizacije
    if (member.role === "OWNER") {
      return next();
    }

    // Ako nisu specificirane role, onda ne moze nijedan korisnik osim organizacije pristupiti
    if (!aquiredRoles) {
      return res.status(400).json({
        message: "Bad Request: No roles specified for access",
        success: false,
      });
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

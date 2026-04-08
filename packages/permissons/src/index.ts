// Database
import { OrganizationMemberRole, UserRole } from "@repo/database";

// TODO: Ovo treba refactorirati jer ownerHasAllaccess vjv jer nema smisla da ovo ostavim ovaj ownerHasAllAccess
export function hasWantedOrganizationRole({
  requiredRoles,
  userRole,
  ownerHasAllAccess = false,
}: {
  userRole?: OrganizationMemberRole | null;
  requiredRoles: OrganizationMemberRole[];
  ownerHasAllAccess?: boolean;
}) {
  if (!userRole) return false;
  if (requiredRoles.length === 0) return false;

  if (ownerHasAllAccess && userRole === "OWNER") return true;

  return requiredRoles.includes(userRole);
}

export function isAdminAccount(role?: UserRole | null) {
  return role === "ADMIN";
}

export function isOrganizationAccount(role?: UserRole | null) {
  return role === "ORGANIZATION" || role === "ADMIN";
}

export function isRegularUserAccount(role?: UserRole | null) {
  return role === "USER";
}

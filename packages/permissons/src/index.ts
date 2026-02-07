// Database
import { OrganizationMemberRole, UserRole } from "@repo/database";

export function hasWantedOrganizationRole({
  requiredRoles,
  userRole,
  ownerHasAllAccess = false,
}: {
  userRole?: OrganizationMemberRole | null;
  requiredRoles: readonly OrganizationMemberRole[];
  ownerHasAllAccess?: boolean;
}) {
  if (!userRole) return false;
  if (requiredRoles.length === 0) return false;

  if (ownerHasAllAccess && userRole === "OWNER") return true;

  return requiredRoles.includes(userRole);
}

export function isOrganizationAccount(role?: UserRole | null) {
  return role === "ORGANIZATION";
}

export function isRegularUserAccount(role?: UserRole | null) {
  return role === "USER";
}

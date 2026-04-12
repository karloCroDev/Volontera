// Database
import { OrganizationMemberRole, UserRole } from "@repo/database";

export function hasWantedOrganizationRole({
  requiredRoles,
  userRole,
}: {
  userRole?: OrganizationMemberRole | null;
  requiredRoles: OrganizationMemberRole[];
}) {
  if (!userRole) return false;
  if (requiredRoles.length === 0) return false;

  return requiredRoles.includes(userRole);
}

export function isAdminAccount(role?: UserRole | null) {
  return role === "ADMIN";
}

export function isOrganizationAccount(role?: UserRole | null) {
  return role === "ORGANIZATION" || role === "ADMIN"; // Admin ima iste privilegije kao i Organization account, pa samo odmah ovdje uspoređujemo oba.
}

export function isRegularUserAccount(role?: UserRole | null) {
  return role === "USER";
}

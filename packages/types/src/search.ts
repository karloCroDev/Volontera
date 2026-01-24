// Database
import { Organization, User } from "@repo/database";
import type { OrganizationWithOwner } from "./organization";

export type SearchResponse = {
  users: Omit<User, "password">[];
  organizations: OrganizationWithOwner[];
};

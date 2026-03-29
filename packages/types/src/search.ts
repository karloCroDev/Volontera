// Database
import { User } from "@repo/database";
import { OrganizationWithOwner } from "./organization";

export type SearchResponse = {
  users: Omit<User, "password">[];
  organizations: OrganizationWithOwner[];
};

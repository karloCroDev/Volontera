// Database
import { Organization, User } from "@repo/database";

export type SearchResponse = {
  users: Omit<User, "password">[];
  organizations: Organization[];
};

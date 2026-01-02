import { Organization, User } from "@repo/database";
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";

type OrganizationSubject = "Organization";
// type TodoSubject = Todo['id'] | 'Todo';

type Permission = [
  "read" | "create" | "update" | "delete",
  OrganizationSubject,
];

export function getUserPermissions(user: User) {
  const { build, can: allow } = new AbilityBuilder<MongoAbility<Permission>>(
    createMongoAbility
  );

  if (user.role === "ORGANIZATION") {
    allow("read", "Organization");
    allow("create", "Organization");
    allow("update", "Organization");
    allow("delete", "Organization");
  } else if (user.role === "USER") {
    allow("read", "Organization");
    allow("update", "Organization");
  }

  return build();
}

// Ako bude trebalo za organizacije i permissone onda koristi

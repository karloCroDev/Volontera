// External packages
import { AbilityBuilder } from "@casl/ability";
import { createPrismaAbility } from "@casl/prisma";

// Database
import { User } from "@repo/database";

// type Actions = "manage" | "create" | "read" | "update" | "delete";

export type AppAbility = ReturnType<typeof createPrismaAbility>;

export function defineAbilityFor({
  role,
  subscriptionTier,
  userId,
}: {
  role: User["role"];
  userId: User["id"];
  subscriptionTier: User["subscriptionTier"];
}): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  if (role === "ADMIN") {
    can("manage", "all");
  }

  if (role === "USER") {
    can("read", "Post");
  }
  if (role === "USER") {
    can("read", "Post");
    can("create", "Post");
    can("update", "User", { id: userId });
  }

  if (role === "ORGANIZATION") {
    can("read", "Organization", { id: "" });
    can("read", "Post", {});
  }
  if (role === "ORGANIZATION" && subscriptionTier == "PRO") {
    can("manage", "Organization", { id: "" });
    can("create", "Post", {});
    can("read", "Post");
  }

  return build();
}

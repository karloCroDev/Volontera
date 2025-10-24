// External packages
import { AbilityBuilder } from "@casl/ability";
import { createPrismaAbility } from "@casl/prisma";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects =
  | "User"
  | "Organization"
  | "Post"
  | "Subscription"
  | "all";

export type AppAbility = ReturnType<typeof createPrismaAbility>;

export function defineAbilityFor({
  role,
  subscriptionTier,
  userId,
}: {
  role: "USER" | "ORGANIZATION" | "ADMIN";
  userId: string;
  subscriptionTier: "BASIC" | "PRO";
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

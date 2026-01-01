// External packages
import { AbilityBuilder } from "@casl/ability";
import { PrismaAbility, createPrismaAbility } from "@casl/prisma";

// Database
import type { User } from "@repo/database";

type Actions = "manage" | "create" | "read" | "update" | "delete" | "access";

export type AppPage =
  | "AUTH"
  | "ONBOARDING"
  | "MAIN"
  | "ORGANIZATION_CREATE"
  | "SELECT_PLAN";

export type PageSubject = { __typename: "Page"; page: AppPage };

export function pageSubject(page: AppPage): PageSubject {
  return { __typename: "Page", page };
}

type PrismaModelSubjects =
  | "User"
  | "Accounts"
  | "Help"
  | "Notification"
  | "DirectMessagesConversations"
  | "ConversationParticipants"
  | "DirectMessages"
  | "DirectMessagesImages"
  | "Organization"
  | "OrganizationInfo"
  | "OrganizationFollowers"
  | "OrganizationAttendees"
  | "AdditionalLinks"
  | "Page"
  | "all";

type AppSubjects = PrismaModelSubjects | PageSubject;

export type AppAbility = PrismaAbility<[Actions, AppSubjects]>;

export type DefineAbilityForInput = {
  userId: User["id"];
  role: User["role"];
  onboardingFinished: User["onboardingFinished"];
  subscriptionTier?: User["subscriptionTier"];
};

export function defineAbilityForGuest(): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  // Guests can only access auth pages.
  can("access", "Page", { page: "AUTH" } as any);

  return build({
    detectSubjectType: (item) =>
      (item as any)?.__typename
        ? (item as any).__typename
        : (item as any).constructor,
  });
}

export function defineAbilityFor({
  role,
  subscriptionTier,
  userId,
  onboardingFinished,
}: DefineAbilityForInput): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  // NOTE:
  // - API middleware currently enforces: auth, role presence (sometimes), and onboardingFinished (for user/org only).
  // - Web layouts enforce: logged-in, onboarding gating, and some role-only pages.
  // This file tries to be the single source of truth for both.

  // Admins: everything.
  if (role === "ADMIN") {
    can("manage", "all");
    can("access", "Page", { page: "MAIN" } as any);
    can("access", "Page", { page: "SELECT_PLAN" } as any);
    can("access", "Page", { page: "ORGANIZATION_CREATE" } as any);
    return build({
      detectSubjectType: (item) =>
        (item as any)?.__typename
          ? (item as any).__typename
          : (item as any).constructor,
    });
  }

  // Base self-ownership rules (safe defaults).
  can("read", "User", { id: userId } as any);
  can("update", "User", { id: userId } as any);

  // Notifications & Help are user-scoped.
  can("read", "Notification", { userId } as any);
  can("update", "Notification", { userId } as any);
  can("create", "Help", { userId } as any);
  can("read", "Help", { userId } as any);
  can("delete", "Help", { userId } as any);

  // Everyone can read public org data.
  can("read", "Organization");
  can("read", "OrganizationInfo");
  can("read", "AdditionalLinks");

  // Direct messages: only within conversations the user participates in.
  can("read", "DirectMessagesConversations", {
    participants: { some: { userId } },
  } as any);
  can("read", "DirectMessages", {
    conversation: { participants: { some: { userId } } },
  } as any);
  can("create", "DirectMessages", { authorId: userId } as any);
  can("update", "DirectMessages", { authorId: userId } as any);
  can("delete", "DirectMessages", { authorId: userId } as any);
  can("read", "DirectMessagesImages", {
    conversation: { authorId: userId },
  } as any);

  // Participation links: you can create/remove your own participant rows.
  can("create", "ConversationParticipants", { userId } as any);
  can("delete", "ConversationParticipants", { userId } as any);

  // Web page gating (optional usage in Next layouts/pages)
  if (!onboardingFinished) {
    can("access", "Page", { page: "ONBOARDING" } as any);
    // Auth pages are still reachable, but your layouts currently redirect anyway.
    can("access", "Page", { page: "AUTH" } as any);
  } else {
    can("access", "Page", { page: "MAIN" } as any);
    can("access", "Page", { page: "SELECT_PLAN" } as any);
  }

  // Role-specific rules.
  if (role === "USER") {
    // Following/attending is only meaningful once onboarding is completed.
    if (onboardingFinished) {
      can("create", "OrganizationFollowers", { followerUserId: userId } as any);
      can("delete", "OrganizationFollowers", { followerUserId: userId } as any);
      can("create", "OrganizationAttendees", { attendeeUserId: userId } as any);
      can("delete", "OrganizationAttendees", { attendeeUserId: userId } as any);
    }
  }

  if (role === "ORGANIZATION") {
    // Creating/managing org data should only be possible after onboarding.
    if (onboardingFinished) {
      can("access", "Page", { page: "ORGANIZATION_CREATE" } as any);

      can("create", "Organization", { ownerId: userId } as any);
      can("update", "Organization", { ownerId: userId } as any);
      can("delete", "Organization", { ownerId: userId } as any);

      can("create", "OrganizationInfo", {
        organization: { ownerId: userId },
      } as any);
      can("update", "OrganizationInfo", {
        organization: { ownerId: userId },
      } as any);

      can("create", "AdditionalLinks", {
        organizationInfo: { organization: { ownerId: userId } },
      } as any);
      can("update", "AdditionalLinks", {
        organizationInfo: { organization: { ownerId: userId } },
      } as any);
      can("delete", "AdditionalLinks", {
        organizationInfo: { organization: { ownerId: userId } },
      } as any);
    }

    // Subscription tier hooks (keep minimal; extend when you add gated features)
    if (subscriptionTier === "PRO") {
      // Placeholder for tier-gated features.
    }
  }

  return build({
    detectSubjectType: (item) =>
      (item as any)?.__typename
        ? (item as any).__typename
        : (item as any).constructor,
  });
}

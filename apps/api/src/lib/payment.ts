// Database
import { Organization, prisma, User } from "@repo/database";

// Pro značajke za sve korisnike unutar organizacije ako owner organizacije ima Pro preplatu.
export async function isOrganizationOwnerOnProPlan(
  organizationId: Organization["id"],
) {
  const organizationOwner = await prisma.user.findFirst({
    where: {
      ownedOrganizations: {
        some: {
          id: organizationId,
        },
      },
    },
  });

  return !!(organizationOwner?.subscriptionTier === "PRO");
}

export async function isUserOnProPlan(userId: User["id"]) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return !!(user?.subscriptionTier === "PRO");
}

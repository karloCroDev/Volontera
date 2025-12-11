// External packages
import { User } from "@prisma/client";

// Config
import { prisma } from "@/config/prisma";

export async function assignSubscription({
  userId,
  customerId,
  subscriptionType,
  pricingId,
}: {
  userId: User["email"];
  customerId: User["customerId"];
  subscriptionType: User["subscriptionType"];
  pricingId: User["pricingId"];
}) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      customerId,
      subscriptionTier: "PRO",
      subscriptionType, // Need to set subscription
      pricingId,
    },
  });
}
export async function removeSubscription({
  customerId,
  pricingId,
}: {
  customerId: string;
  pricingId: User["pricingId"];
}) {
  return await prisma.user.update({
    where: { customerId },
    data: {
      customerId,
      subscriptionTier: "BASIC",
      subscriptionType: "NONE", // Need to set subscription
      pricingId,
    },
  });
}

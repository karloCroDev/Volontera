// Config
import { prisma } from "@/config/prisma";
import { User } from "@prisma/client";
import { AdditionalFormArgs } from "@repo/schemas/onboarding";

export async function updateUserOnboarding({
  data,
  userId,
}: {
  userId: User["id"];
  data: Partial<Omit<AdditionalFormArgs, "image">>;
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      onboardingFinished: true,
    },
  });
}

export async function finishOnboarding(userId: User["id"]) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      onboardingFinished: true,
    },
  });
}

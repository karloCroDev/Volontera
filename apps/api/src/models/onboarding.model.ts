// Database
import { prisma, User } from "@repo/database";

// Types
import { AppType } from "@repo/types/onboarding";

export async function updateUserOnboarding({
  data,
  userId,
}: {
  userId: User["id"];
  data: Partial<User>;
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

export async function updateUserAppType({
  userId,
  type,
}: {
  userId: string;
  type: AppType;
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role: type,
    },
  });
}

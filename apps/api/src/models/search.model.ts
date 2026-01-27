// Database
import { prisma, User } from "@repo/database";

export async function searchUsers({
  query,
  userId,
}: {
  query: string;
  userId: User["id"];
}) {
  return prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            OR: [
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        subscriptionTier: true,
        subscriptionType: true,
        onboardingFinished: true,
      },
      take: 5,
    });

    const organizations = await tx.organization.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        avatarImage: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true,
            subscriptionTier: true,
            subscriptionType: true,
            onboardingFinished: true,
          },
        },
      },
      take: 5,
    });
    return {
      users,
      organizations,
    };
  });
}

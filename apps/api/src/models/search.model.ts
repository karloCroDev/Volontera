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
      omit: {
        password: true,
      },
    });

    const organizations = await tx.organization.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      include: {
        owner: {
          omit: {
            password: true,
          },
        },
      },
    });
    return {
      users,
      organizations,
    };
  });
}

// Database
import { prisma, User, UserRole } from "@repo/database";

type SearchProps = {
  query: string;
  userId: User["id"];
};

export async function searchUsersAndOrganizations({
  query,
  userId,
}: SearchProps) {
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
              { address: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      omit: {
        password: true,
      },
      take: 5,
    });

    const organizations = await tx.organization.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          {
            organizationInfo: {
              location: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      take: 5,
    });
    return {
      users,
      organizations,
    };
  });
}

export async function searchUsers({
  query,
  userId,
  filter,
}: SearchProps & {
  filter?: UserRole;
}) {
  return await prisma.user.findMany({
    where: {
      role: filter ? filter : undefined,
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
}

export async function searchOrganizations({ query }: { query: string }) {
  return await prisma.organization.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        {
          organizationInfo: {
            location: { contains: query, mode: "insensitive" },
          },
        },
      ],
    },
  });
}

// Database
import { prisma, User } from "@repo/database";

export async function findUserById(userId: User["id"]) {
  return prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
}

export async function retrieveAllOrganizationsForUser(userId: User["id"]) {
  return prisma.organization.findMany({
    where: {
      organizationMembers: {
        some: {
          userId,
        },
      },
    },
    include: {},
  });
}

export async function retrieveAllPostsForUser(userId: User["id"]) {
  return prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });
}

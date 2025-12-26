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

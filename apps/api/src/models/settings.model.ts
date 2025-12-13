// External packages
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

// Lib
import { prisma } from "@/config/prisma";

export async function updateUsersInformation({
  data,
  userId,
}: {
  userId: User["id"];
  data: Partial<User>;
}) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
}

export async function getUsersOldPassword(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  return user?.password;
}

export async function updateUsersPassword({
  userId,
  newPassword,
}: {
  userId: User["id"];
  newPassword: string;
}) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

export async function deleteUserAccount(userId: User["id"]) {
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

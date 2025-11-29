// External packages
import { prisma } from "@/config/prisma";
import { User } from "@prisma/client";

// Repo
import { SettingsArgs } from "@repo/schemas/settings";

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

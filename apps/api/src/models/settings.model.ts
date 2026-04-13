// Database
import { prisma, User } from "@repo/database";

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
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
}

export async function deleteUserAccount(userId: User["id"]) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    const conversations = await tx.directMessagesConversations.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (conversations.length > 0) {
      await tx.directMessagesConversations.deleteMany({
        where: {
          id: {
            in: conversations.map((conversation) => conversation.id),
          },
        },
      });
    }

    await tx.user.delete({
      where: {
        id: userId,
      },
    });

    return user;
  });
}

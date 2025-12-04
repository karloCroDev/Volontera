// Exteral packages
import { User, Help } from "@prisma/client";

// Config
import { prisma } from "@/config/prisma";

export async function addUsersQuestionWithLLMResponse({
  userId,
  usersQuestion,
  llmResponse,
}: {
  userId: User["id"];
  llmResponse: Help["content"];
  usersQuestion: Help["content"];
}) {
  return await prisma.help.createMany({
    data: [
      {
        content: usersQuestion,
        senderType: "USER",
        userId,
      },
      {
        content: llmResponse,
        senderType: "AI",
        userId,
      },
    ],
  });
}

export async function retrieveHelpMessages(userId: User["id"]) {
  const messages = await prisma.help.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
}

export async function deleteMessages(userId: User["id"]) {
  return await prisma.help.deleteMany({
    where: {
      userId,
    },
  });
}

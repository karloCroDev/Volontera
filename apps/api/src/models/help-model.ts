// Config
import { prisma } from "@/config/prisma";

export async function addUsersQuestionWithLLMResponse({
  conversationId,
  usersQuestion,
  LLMResponse,
}: {
  conversationId: string;
  LLMResponse: string;
  usersQuestion: string;
}) {
  return await prisma.helpMessage.createMany({
    data: [
      {
        message: usersQuestion,
        senderType: "USER",
        helpId: conversationId,
      },
      {
        message: LLMResponse,
        senderType: "AI",
        helpId: conversationId,
      },
    ],
  });
}

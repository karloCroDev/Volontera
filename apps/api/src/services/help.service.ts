// Lib
import { prisma } from "@/config/prisma";
import { getLlmResponse, safetyCheckLlmReponse } from "@/lib/llm-response";
import { addUsersQuestionWithLLMResponse } from "@/models/help-model";
import { User } from "@prisma/client";

// Schemas
import { helpConversationSchema } from "@repo/schemas/help";

export async function helpConversationService({
  rawData,
  userId,
  role,
}: {
  rawData: unknown;
  userId: string;
  role: Required<User["role"]>;
}) {
  const { success, data } = helpConversationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot send this data",
        message: "Invalid data",
      },
    };
  }

  // 1 line of defense
  const regex =
    /(\b(?:hate|violence|drugs|terrorism|porn|illegal activities|suicide|self-harm)\b)/i;

  if (regex.test(data.message)) {
    return {
      status: 400,
      body: {
        title: "Inappropriate content detected",
        message:
          "Your message contains inappropriate content and cannot be processed.",
      },
    };
  }

  // TODO: Write all routes and features (do this once the frontend is done)
  const appRules =
    role === "USER"
      ? "You are a helpful AI assistant that has context about this application [app] and tries to assist and navigate users throughout the application. Awesome so here are the app features once the users is logged in."
      : role === "ORGANIZATION"
        ? "You are a helpful AI assistant that has context about this application [app] and tries to assist and navigate organizations throughout the application. Awesome so here are the app features once the organization is logged in."
        : "Your admin you have full access to the application and its features, including the questons and answers";

  // Mitiganiting jailbreaks (lighweight model for checking the )
  const AIGuard = await safetyCheckLlmReponse();

  if (AIGuard === "Y") {
    return {
      status: 400,
      body: {
        title: "Inappropriate content detected",
        message:
          "Your message contains inappropriate content and cannot be processed.",
      },
    };
  }

  const LLMResponse = await getLlmResponse(
    `${appRules} \n Users response:${data.message}`
  );

  const conversation = await prisma.helpConversation.create({
    data: {
      userId,
    },
  });

  await addUsersQuestionWithLLMResponse({
    conversationId: conversation.id,
    usersQuestion: data.message,
    LLMResponse,
  });

  return {
    status: 200,
    body: { message: "Message sent successfully" },
  };
}

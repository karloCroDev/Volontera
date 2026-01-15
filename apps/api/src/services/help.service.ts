// External packages
import { User } from "@repo/database";

// Lib
import { getLlmResponse, safetyCheckLlmReponse } from "@/lib/llm-response";

// Models
import {
  addUsersQuestionWithLLMResponse,
  deleteMessages,
  retrieveHelpMessages,
} from "@/models/help-model";

// Schema types
import { HelpConversationSchemaArgs } from "@repo/schemas/help";
import { toastResponseOutput } from "@/lib/utils/service-output";

export async function addQuestionService({
  data,
  userId,
  role,
}: {
  data: HelpConversationSchemaArgs;
  userId: string;
  role: Required<User["role"]>;
}) {
  // 1 line of defense
  const regex =
    /(\b(?:hate|violence|drugs|terrorism|porn|illegal activities|suicide|self-harm)\b)/i;

  const innapropriateContent = toastResponseOutput({
    status: 400,
    message: "Inappropriate content detected",
    title: "Inappropriate content detected",
  });

  if (regex.test(data.message)) {
    return innapropriateContent;
  }

  // TODO: Write all routes and features (do this once the frontend is done)
  const appRules =
    role === "USER"
      ? "You are a helpful AI assistant that has context about this application [app] and tries to assist and navigate users throughout the application. Awesome so here are the app features once the users is logged in."
      : role === "ORGANIZATION"
        ? "You are a helpful AI assistant that has context about this application [app] and tries to assist and navigate organizators throughout the application. Awesome so here are the app features once the organization is logged in."
        : "Your admin you have full access to the application and its features, including the questons and answers";

  // Mitiganiting jailbreaks (lighweight model for checking the )
  const AIGuard = await safetyCheckLlmReponse();

  if (AIGuard === "Y") {
    return innapropriateContent;
  }

  const llmResponse = await getLlmResponse(
    `${appRules} \n Users response:${data.message}`
  );

  await addUsersQuestionWithLLMResponse({
    userId,
    usersQuestion: data.message,
    llmResponse,
  });

  return toastResponseOutput({
    status: 200,
    message: "Message sent successfully",
    title: "Message sent successfully",
    data: { llmResponse },
  });
}

export async function getHelpMessagesService(userId: string) {
  const allMessages = await retrieveHelpMessages(userId);

  return {
    status: 200,
    body: {
      success: true,
      title: allMessages.length
        ? undefined
        : "Ask our AI assistant any question about [app]!",
      message: "Messages retrieved successfully",
      messages: allMessages, // empty array if no messages
    },
  };
}

export async function deleteConversationService(userId: User["id"]) {
  const deleteConversation = await deleteMessages(userId);
  const existed = deleteConversation.count > 0;

  return {
    status: 200,
    body: {
      title: existed
        ? "Conversation deleted successfully"
        : "No conversation to delete",
      messages: existed
        ? "Feel free to start a new conversation with our AI assistant"
        : "You can begin chatting anytime",
    },
  };
}

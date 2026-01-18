// External packages
import { User } from "@repo/database";

// Lib
import { getLlmResponse, safetyCheckLlmReponse } from "@/lib/llm-response";
import { toastResponseOutput } from "@/lib/utils/service-output";
import { violenceRegex } from "@/lib/utils/regex";

// Models
import {
  addUsersQuestionWithLLMResponse,
  deleteMessages,
  retrieveHelpMessages,
} from "@/models/help-model";

// Schema types
import { HelpConversationSchemaArgs } from "@repo/schemas/help";

export async function addQuestionService({
  data,
  userId,
  role,
}: {
  data: HelpConversationSchemaArgs;
  userId: string;
  role: Required<User["role"]>;
}) {
  const innapropriateContent = toastResponseOutput({
    status: 400,
    message: "Inappropriate content detected",
    title: "Inappropriate content detected",
  });
  // 1 linija obrane - regex filter
  if (violenceRegex.test(data.message)) {
    return innapropriateContent;
  }

  const routesDescription = `
      / home - Infinite scroll of all available posts about volunteering achievments made by every organization where users can like, comment, and share posts.
      / settings - Users can update their personal information, change password, and delete account.
      / notifications - Users can see all their notifications about if they have entered a voulnteering organization, got a new message or a comment etc.
      / direct-messages - Users can directly chat with the heads of organizations or with the other users,
      / public-profile - Users can see and edit their public profile which contains their basic information, volunteering history, skills, and reviews made by organizations.
      / manage-plans - Organizations or users can buy premium plans to unlock additional features and support the platform.
      / organizations - Users can browse and search for volunteering organizations, see their profiles posts and follow them or send request to join the organization.
      / organizations/group-chat - Once the user has joined an organization, they can access the group chat for that organization where they can communicate with other members and organization heads.
      / organization/tasks - Once the user has joined an organization, they can see all the tasks in a kanban board view assigned to them by the organization heads and manage their tasks.
      `;
  // TODO: Write all routes and features (do this once the frontend is done)
  const appRules =
    role === "USER"
      ? `You are a helpful AI assistant that has context about this application Volontera and tries to assist and navigate users throughout the application. Awesome so here are the app routes with features descibed once the users is logged in.
      ${routesDescription}
      `
      : role === "ORGANIZATION" &&
        `You are a helpful AI assistant that has context about this application Volontera and tries to assist and navigate organizators throughout the application. Awesome so here are the app features once the organization is logged in.
          ${routesDescription}
           /organization/manage - Organization heads can manage all the members of the organization, approve or reject join requests, and assign roles to members. Also it includes in the pro plan a dashboard that can be easily used inside the app.
        `;

  // 2. linija obrane - Lightweight model koji koristi kako bi provjerili je li korisnik pita harmful pitanja
  const AIGuard = await safetyCheckLlmReponse(data.message);

  if (AIGuard === "Y") {
    return innapropriateContent;
  }

  const llmResponse = await getLlmResponse(
    `${appRules} \n Users response:${data.message}`,
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

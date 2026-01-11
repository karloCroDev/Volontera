// Models
import {
  createOrganizationGroupChatMessage,
  deleteOrganizationGroupChatMessage,
  retrieveAllOrganizationGroupChatMessages,
} from "@/models/organization-group-chat.model";

// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Database
import { User } from "@repo/database";

// Schema types
import {
  CreateOrganizationGroupChatMessageArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
  DeleteOrganizationGroupChatMessageArgs,
} from "@repo/schemas/organization-group-chat";
import { io } from "@/ws/socket";

export async function retrieveAllOrganizationGroupChatMessagesService({
  organizationId,
}: RetrieveAllOrganizationGroupChatMessagesArgs) {
  const organizationGroupChat =
    await retrieveAllOrganizationGroupChatMessages(organizationId);

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved all organization group chat messages",
    data: { organizationGroupChat },
    success: true,
  });
}

export async function createOrganizationGroupChatMessageService({
  data,
  userId,
}: {
  data: CreateOrganizationGroupChatMessageArgs;
  userId: User["id"];
}) {
  const messages = await createOrganizationGroupChatMessage({
    ...data,
    senderId: userId,
  });

  io.to(`organization:${data.organizationId}`).emit(
    "organization-group-chat:new-message",
    messages
  );

  return toastResponseOutput({
    title: "Success",
    message: "Successfully created organization group chat message",
    status: 200,
  });
}

export async function deleteOrganizationGroupChatMessageService({
  data,
  userId,
}: {
  data: DeleteOrganizationGroupChatMessageArgs;
  userId: User["id"];
}) {
  // Implementation for deleting a message goes here

  await deleteOrganizationGroupChatMessage({
    messageId: data.messageId,
    userId,
  });
  return toastResponseOutput({
    title: "Info",
    message: "Delete message functionality not yet implemented",
    status: 200,
  });
}

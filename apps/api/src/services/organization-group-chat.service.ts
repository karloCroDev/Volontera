// Models
import { serverFetchOutput } from "@/lib/utils/service-output";
import {
  createOrganizationGroupChatMessage,
  retrieveAllOrganizationGroupChatMessages,
} from "@/models/organization-group-chat.model";
import { User } from "@repo/database";

// Schema types
import {
  CreateOrganizationGroupChatMessageArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
} from "@repo/schemas/organization-group-chat";

export async function retrieveAllOrganizationGroupChatMessagesService({
  organizationId,
}: RetrieveAllOrganizationGroupChatMessagesArgs) {
  const messages =
    await retrieveAllOrganizationGroupChatMessages(organizationId);

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved all organization group chat messages",
    data: { messages },
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
  const message = await createOrganizationGroupChatMessage({
    ...data,
    senderId: userId,
  });
  return serverFetchOutput({
    status: 200,
    message: "Successfully created organization group chat message",
    data: { message },
    success: true,
  });
}

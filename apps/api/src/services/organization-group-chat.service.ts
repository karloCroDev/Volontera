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

// Permissions
import { hasWantedOrganizationRole } from "@repo/permissons/index";

// Schemas
import {
  CreateOrganizationGroupChatMessageArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
  DeleteOrganizationGroupChatMessageArgs,
} from "@repo/schemas/organization-group-chat";

// Websockets
import { io } from "@/ws/socket";

// Models
import { createNotifications } from "@/models/notification.model";
import {
  retrieveAllMembersInOrganization,
  retrieveOrganizationMember,
} from "@/models/organization-managment.model";

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
  const message = await createOrganizationGroupChatMessage({
    ...data,
    senderId: userId,
  });

  const member = await retrieveOrganizationMember({
    organizationId: data.organizationId,
    userId,
  });

  io.to(`organization:${data.organizationId}`).emit(
    "organization-group-chat:new-message",
    message,
  );

  // Ako je admin ili korisnik onda se svima pošalje notifikacija
  if (
    hasWantedOrganizationRole({
      userRole: member?.role,
      requiredRoles: ["ADMIN"],
      ownerHasAllAccess: true,
    })
  ) {
    const members = await retrieveAllMembersInOrganization({
      organizationId: data.organizationId,
      userId,
    });

    if (members.length > 0) {
      await createNotifications(
        members.map((member) => ({
          userId: member.userId,
          content: `New message in organization group chat: ${data.content}`,
        })),
      );
    }
  }

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
  const deletedMessage = await deleteOrganizationGroupChatMessage({
    messageId: data.messageId,
    userId,
  });

  io.to(
    `organization:${deletedMessage.organizationGroupChat.organizationId}`,
  ).emit("organization-group-chat:message-deleted", {
    messageId: deletedMessage.id,
    organizationId: deletedMessage.organizationGroupChat.organizationId,
  });

  return toastResponseOutput({
    title: "Message deleted",
    message: "Message deleted successfully",
    status: 200,
  });
}

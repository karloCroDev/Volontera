// External packages
import { compareAsc } from "date-fns";

// Database
import { User } from "@repo/database";

// Permissions
import { hasWantedOrganizationRole } from "@repo/permissons/index";

// Schemas
import {
  CreateOrganizationChannelMessageArgs,
  DeleteOrganizationChannelMessageArgs,
  RetrieveAllOrganizationChannelMessagesArgs,
} from "@repo/schemas/organization-channel-messages";

// Models
import { createMultipleNotifications } from "@/models/notification.model";
import {
  retrieveAllMembersInOrganization,
  retrieveOrganizationMember,
} from "@/models/organization-managment.model";

// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Websockets
import { io } from "@/ws/socket";

// Services
import { resolveImageKeysToUrls } from "@/services/image.service";

// Models
import {
  retrieveAllMesssagesFromChannel,
  createOrganizationGroupChatMessage,
  deleteOrganizationChannelChatMessage,
} from "@/models/organization-channel-messages.model";

// Ako su želim se osigurati da su slike koje šaljemo klijentima nisu javne već da su to privremeni presigned URL-ovi koje hashiramo preko image key-a koji je pohranjen u bazi. Na taj način osiguravamo da samo ovlašteni korisnici mogu pristupiti slikama i da URL-ovi imaju ograničen rok trajanja radi sigurnosti (za razliku od javinh URL ova). Zato ovdje resolvamo slike

export async function retrieveAllMesssagesFromChannelService({
  organizationId,
  groupChatId,
}: RetrieveAllOrganizationChannelMessagesArgs) {
  const organizationChannel = await retrieveAllMesssagesFromChannel({
    organizationId,
    channelChatId: groupChatId,
  });

  if (!organizationChannel) {
    return serverFetchOutput({
      status: 400,
      message: "Organization channel not found",
      data: { organizationChannel: null },
      success: false,
    });
  }

  const messages = organizationChannel.messages
    .sort((firstMessage, secondMessage) =>
      compareAsc(
        new Date(firstMessage.createdAt),
        new Date(secondMessage.createdAt),
      ),
    )
    .map((message) => ({
      ...message,
      groupChatId: message.channelChatId,
      organizationGroupChatMessageImages:
        message.organizationChannelChatMessageImages,
    }));

  const imageKeys = messages
    .flatMap((m) =>
      m.organizationGroupChatMessageImages.map((img) => img.imageUrl),
    )
    .filter(Boolean);

  const urlsByKey = await resolveImageKeysToUrls(imageKeys);

  const enrichedOrganizationChannel = {
    ...organizationChannel,
    messages: messages.map((message) => ({
      ...message,
      organizationGroupChatMessageImages:
        message.organizationGroupChatMessageImages.flatMap((img) => {
          const presignedUrl = img.imageUrl ? urlsByKey[img.imageUrl] : null;
          if (!presignedUrl) return [];
          return [{ ...img, imageUrl: presignedUrl }];
        }),
    })),
  };

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved organization channel messages",
    data: { organizationChannel: enrichedOrganizationChannel },
    success: true,
  });
}

export async function createOrganizationGroupChatMessageService({
  data,
  userId,
}: {
  data: CreateOrganizationChannelMessageArgs;
  userId: User["id"];
}) {
  const targetChannel = await retrieveAllMesssagesFromChannel({
    organizationId: data.organizationId,
    channelChatId: data.groupChatId,
  });

  if (!targetChannel) {
    return toastResponseOutput({
      title: "Error",
      message: "Channel not found for this organization",
      status: 400,
    });
  }

  const message = await createOrganizationGroupChatMessage({
    content: data.content,
    channelChatId: targetChannel.id,
    parentMessageId: data.parentMessageId,
    imageKeys: data.imageKeys,
    senderId: userId,
  });

  const attachmentKeys = message.organizationChannelChatMessageImages
    .map((img) => img.imageUrl)
    .filter(Boolean);

  const urlsByKey = await resolveImageKeysToUrls(attachmentKeys);

  const enrichedMessage = {
    ...message,
    groupChatId: targetChannel.id,
    organizationGroupChatMessageImages:
      message.organizationChannelChatMessageImages.flatMap((img) => {
        const presignedUrl = img.imageUrl ? urlsByKey[img.imageUrl] : null;
        if (!presignedUrl) return [];
        return [{ ...img, imageUrl: presignedUrl }];
      }),
  };

  const member = await retrieveOrganizationMember({
    organizationId: data.organizationId,
    userId,
  });

  io.to(`organization:${data.organizationId}`).emit(
    "organization-group-chat:new-message",
    enrichedMessage,
  );

  // Ako je admin ili vlasnik onda se svima pošalje notifikacija
  if (
    hasWantedOrganizationRole({
      userRole: member?.role,
      requiredRoles: ["ADMIN", "OWNER"],
    })
  ) {
    const members = await retrieveAllMembersInOrganization({
      organizationId: data.organizationId,
      userId,
    });

    if (members.length > 0) {
      await createMultipleNotifications(
        members.map((member) => ({
          userId: member.userId,
          senderId: userId,
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
  data: DeleteOrganizationChannelMessageArgs;
  userId: User["id"];
}) {
  const { deletedMessageIds } = await deleteOrganizationChannelChatMessage({
    messageId: data.messageId,
    userId,
  });

  io.to(`organization:${data.organizationId}`).emit(
    "organization-group-chat:message-deleted",
    {
      messageId: data.messageId,
      messageIds: deletedMessageIds,
      organizationId: data.organizationId,
    },
  );

  return toastResponseOutput({
    title: "Message deleted",
    message: "Message deleted successfully",
    status: 200,
  });
}

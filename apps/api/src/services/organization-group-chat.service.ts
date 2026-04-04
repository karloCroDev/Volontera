// Models
import {
  createOrganizationChannelChat,
  createOrganizationGroupChatMessage,
  deleteOrganizationChannelChatMessage,
  deleteOrganizationChannelChat,
  retrieveAllOrganizationChannelChatMessages,
  retrieveOrganizationGroupChatChannels,
  updateOrganizationChannelChat,
} from "@/models/organization-group-chat.model";

// Database
import { User } from "@repo/database";

// Permissions
import { hasWantedOrganizationRole } from "@repo/permissons/index";

// Schemas
import {
  CreateOrganizationGroupChatChannelArgs,
  CreateOrganizationGroupChatMessageArgs,
  DeleteOrganizationGroupChatChannelArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
  RetrieveOrganizationGroupChatChannelsArgs,
  DeleteOrganizationGroupChatMessageArgs,
  UpdateOrganizationGroupChatChannelArgs,
} from "@repo/schemas/organization-group-chat";

// Models
import { createNotifications } from "@/models/notification.model";
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

// Channels
export async function retrieveOrganizationGroupChatChannelsService({
  organizationId,
}: RetrieveOrganizationGroupChatChannelsArgs) {
  const organizationGroupChat =
    await retrieveOrganizationGroupChatChannels(organizationId);

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved organization group chat channels",
    data: { organizationGroupChat },
    success: true,
  });
}

export async function createOrganizationGroupChatChannelService({
  data,
}: {
  data: CreateOrganizationGroupChatChannelArgs;
}) {
  const createdChannel = await createOrganizationChannelChat({
    organizationId: data.organizationId,
    channelName: data.channelName,
    dsescription: data.description,
  });

  return toastResponseOutput({
    title: `Successful created ${createdChannel.name} channel`,
    message: `Successfully created ${createdChannel.name} channel`,
    status: 200,
  });
}

export async function updateOrganizationGroupChatChannelService({
  data,
}: {
  data: UpdateOrganizationGroupChatChannelArgs;
}) {
  await updateOrganizationChannelChat({
    channelId: data.channelId,
    organizationId: data.organizationId,
    channelName: data.channelName,
    description: data.description,
  });

  return toastResponseOutput({
    title: `Successfuly updated ${data.channelName} channel`,
    message: `Successfully updated ${data.channelName} channel`,
    status: 200,
  });
}

export async function deleteOrganizationGroupChatChannelService({
  data,
}: {
  data: DeleteOrganizationGroupChatChannelArgs;
}) {
  const deletedChannel = await deleteOrganizationChannelChat({
    channelId: data.channelId,
    organizationId: data.organizationId,
  });

  return toastResponseOutput({
    title: `Successfuly deleted ${deletedChannel.name} channel`,
    message: `Successfully deleted ${deletedChannel.name} channel`,
    status: 200,
  });
}

// Messages
export async function retrieveAllOrganizationGroupChatMessagesService({
  organizationId,
}: RetrieveAllOrganizationGroupChatMessagesArgs) {
  const organizationGroupChat =
    await retrieveOrganizationGroupChatChannels(organizationId);

  if (!organizationGroupChat) {
    return serverFetchOutput({
      status: 400,
      message: "Organization group chat not found",
      data: { organizationGroupChat: null },
      success: false,
    });
  }

  const channelsWithMessages = await Promise.all(
    organizationGroupChat.channelChat.map(async (channel) => {
      const channelWithMessages =
        await retrieveAllOrganizationChannelChatMessages(channel.id);

      return channelWithMessages?.messages ?? [];
    }),
  );

  const messages = channelsWithMessages
    .flatMap((channelMessages) => channelMessages)
    .sort(
      (firstMessage, secondMessage) =>
        new Date(firstMessage.createdAt).getTime() -
        new Date(secondMessage.createdAt).getTime(),
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

  const enrichedOrganizationGroupChat = {
    ...organizationGroupChat,
    messages: messages.map((message) => ({
      ...message,
      organizationGroupChatMessageImages:
        message.organizationGroupChatMessageImages.flatMap((img) => {
          const presignedUrl = img.imageUrl ? urlsByKey[img.imageUrl] : null;
          if (!presignedUrl) return;
          return [{ ...img, imageUrl: presignedUrl }];
        }),
    })),
  };

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved all organization group chat messages",
    data: { organizationGroupChat: enrichedOrganizationGroupChat },
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
  const channels = await retrieveOrganizationGroupChatChannels(
    data.organizationId,
  );

  if (!channels || channels.channelChat.length === 0) {
    return toastResponseOutput({
      title: "Error",
      message: "No available channel for this organization",
      status: 404,
    });
  }

  const targetChannel =
    channels.channelChat.find((channel) => channel.id === data.groupChatId) ??
    channels.channelChat[0];

  if (!targetChannel) {
    return toastResponseOutput({
      title: "Error",
      message: "No available channel for this organization",
      status: 404,
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
  const { organizationId, deletedMessageIds } =
    await deleteOrganizationChannelChatMessage({
      messageId: data.messageId,
      userId,
    });

  io.to(`organization:${organizationId ?? data.organizationId}`).emit(
    "organization-group-chat:message-deleted",
    {
      messageId: data.messageId,
      messageIds: deletedMessageIds,
      organizationId: organizationId ?? data.organizationId,
    },
  );

  return toastResponseOutput({
    title: "Message deleted",
    message: "Message deleted successfully",
    status: 200,
  });
}

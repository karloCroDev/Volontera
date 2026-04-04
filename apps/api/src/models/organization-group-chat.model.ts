// Database
import {
  Organization,
  OrganizationChannelChat,
  prisma,
  User,
  OrganizationChannelChatMessage,
} from "@repo/database";

// Channels
export async function retrieveOrganizationGroupChatChannels(
  organizationId: Organization["id"],
) {
  return prisma.organizationGroupChat.findUnique({
    where: {
      organizationId,
    },
    include: {
      channelChat: true,
    },
  });
}

export async function createOrganizationChannelChat({
  organizationId,
  channelName,
  dsescription,
}: {
  organizationId: Organization["id"];
  channelName: OrganizationChannelChat["name"];
  dsescription?: OrganizationChannelChat["description"];
}) {
  return prisma.organizationChannelChat.create({
    data: {
      name: channelName,
      description: dsescription,
      organizationId,
    },
  });
}

export async function deleteOrganizationChannelChat({
  channelId,
  organizationId,
}: {
  channelId: OrganizationChannelChat["id"];
  organizationId: Organization["id"];
}) {
  return prisma.organizationChannelChat.deleteMany({
    where: {
      id: channelId,
      organizationId,
    },
  });
}

export async function updateOrganizationChannelChat({
  channelId,
  organizationId,
  channelName,
  description,
}: {
  channelId: OrganizationChannelChat["id"];
  organizationId: Organization["id"];
  channelName?: OrganizationChannelChat["name"];
  description?: OrganizationChannelChat["description"];
}) {
  // TODO: Indexiraj ovo pod hitno!!!
  return prisma.organizationChannelChat.update({
    where: {
      id: channelId,
      organizationId,
    },
    data: {
      ...(channelName ? { name: channelName } : {}),
      ...(description ? { description } : {}),
    },
  });
}

// Messaging
export async function retrieveAllOrganizationChannelChatMessages(
  channelChatId: OrganizationChannelChat["id"],
) {
  return prisma.organizationChannelChat.findUnique({
    where: {
      id: channelChatId,
    },
    include: {
      messages: {
        include: {
          organizationChannelChatMessageImages: true,
          parentMessage: {
            select: {
              id: true,
              content: true,
              author: {
                omit: {
                  password: true,
                },
              },
            },
          },
          author: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
}

export async function createOrganizationGroupChatMessage({
  content,
  channelChatId,
  senderId,
  parentMessageId,
  imageKeys,
}: {
  channelChatId: OrganizationChannelChat["id"];
  senderId: User["id"];
  content: OrganizationChannelChatMessage["content"];
  parentMessageId?: OrganizationChannelChatMessage["id"];
  imageKeys?: string[];
}) {
  return prisma.organizationChannelChatMessage.create({
    data: {
      content,
      authorId: senderId,
      channelChatId,
      ...(parentMessageId ? { parentMessageId } : {}),
      organizationChannelChatMessageImages: {
        createMany:
          imageKeys && imageKeys.length > 0
            ? {
                data: imageKeys.map((key) => ({
                  imageUrl: key,
                })),
              }
            : undefined,
      },
    },
    include: {
      organizationChannelChatMessageImages: true,
      parentMessage: {
        select: {
          id: true,
          content: true,
          author: {
            omit: {
              password: true,
            },
          },
        },
      },
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
}

export async function deleteOrganizationChannelChatMessage({
  messageId,
  userId,
}: {
  userId: User["id"];
  messageId: OrganizationChannelChatMessage["id"];
}) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.organizationChannelChatMessage.findUnique({
      where: {
        id: messageId,
        authorId: userId,
      },
      select: {
        id: true,
        replyMessage: {
          select: {
            id: true,
          },
        },
        // organizationChannelChat: {
        //   select: {
        //     organizationId: true,
        //   },
        // },
        organizationChannelChat: {
          select: {
            organizationGroupChat: {
              select: {
                organizationId: true,
              },
            },
          },
        },
      },
    });

    if (!message) {
      throw new Error(
        "Message not found or you are not the author of the message",
      );
    }

    const deletedMessageIds = [
      message.id,
      ...message.replyMessage.map((reply) => reply.id),
    ];

    await tx.organizationChannelChatMessage.delete({
      where: {
        id: messageId,
      },
    });

    return {
      organizationId:
        message.organizationChannelChat.organizationGroupChat?.organizationId,
      deletedMessageIds,
    };
  });
}

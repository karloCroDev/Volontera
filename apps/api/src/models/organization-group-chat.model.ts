// Database
import {
  Organization,
  OrganizationGroupChat,
  OrganizationGroupChatMessage,
  prisma,
  User,
} from "@repo/database";

export async function retrieveAllOrganizationGroupChatMessages(
  organizationId: Organization["id"],
) {
  return prisma.organizationGroupChat.findUnique({
    where: {
      organizationId,
    },
    include: {
      messages: {
        include: {
          organizationGroupChatMessageImages: true,
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
  groupChatId,
  senderId,
  parentMessageId,
  imageKeys,
}: {
  groupChatId: OrganizationGroupChat["id"];
  senderId: User["id"];
  content: OrganizationGroupChatMessage["content"];
  parentMessageId?: OrganizationGroupChatMessage["id"];
  imageKeys?: string[];
}) {
  return prisma.organizationGroupChatMessage.create({
    data: {
      content,
      authorId: senderId,
      groupChatId: groupChatId,
      ...(parentMessageId ? { parentMessageId } : {}),
      organizationGroupChatMessageImages: {
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
      organizationGroupChatMessageImages: true,
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

export async function deleteOrganizationGroupChatMessage({
  messageId,
  userId,
}: {
  userId: User["id"];
  messageId: OrganizationGroupChatMessage["id"];
}) {
  return prisma.$transaction(async (tx) => {
    const message = await tx.organizationGroupChatMessage.findUnique({
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
        organizationGroupChat: {
          select: {
            organizationId: true,
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

    await tx.organizationGroupChatMessage.delete({
      where: {
        id: messageId,
      },
    });

    return {
      organizationId: message.organizationGroupChat.organizationId,
      deletedMessageIds,
    };
  });
}

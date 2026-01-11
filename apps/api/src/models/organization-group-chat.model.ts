// Database
import {
  Organization,
  OrganizationGroupChat,
  OrganizationGroupChatMessage,
  prisma,
  User,
} from "@repo/database";

export async function retrieveAllOrganizationGroupChatMessages(
  organizationId: Organization["id"]
) {
  return prisma.organizationGroupChat.findUnique({
    where: {
      organizationId,
    },
    include: {
      messages: {
        include: {
          organizationGroupChatMessageImages: true,
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
  imageKeys,
}: {
  groupChatId: OrganizationGroupChat["id"];
  senderId: User["id"];
  content: OrganizationGroupChatMessage["content"];
  imageKeys?: string[];
}) {
  return prisma.organizationGroupChatMessage.create({
    data: {
      content,
      authorId: senderId,
      groupChatId: groupChatId,
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
  return prisma.organizationGroupChatMessage.delete({
    where: {
      id: messageId,
      authorId: userId,
    },
  });
}

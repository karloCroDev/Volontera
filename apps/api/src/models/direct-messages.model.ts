// Database
import { prisma, User, DirectMessagesConversations } from "@repo/database";

export async function listAllDirectMessagesConversation({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.directMessagesConversations.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getDirectMessagesConversationById({
  conversationId,
}: {
  conversationId: DirectMessagesConversations["id"];
}) {
  return prisma.directMessagesConversations.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      directMessages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function createDirectMessagesConversation({
  participantIds,
}: {
  participantIds: User["id"][];
}) {
  return prisma.directMessagesConversations.create({
    data: {
      participants: {
        create: participantIds.map((id) => ({
          userId: id,
        })),
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function updateDirectMessagesConversationLastMessage({
  conversationId,
  lastMessage,
}: {
  conversationId: DirectMessagesConversations["id"];
  lastMessage: DirectMessagesConversations["lastMessage"];
}) {
  return prisma.directMessagesConversations.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessage,
    },
  });
}

export async function createMessageInDirectMessagesConversation({
  conversationId,
  authorId,
  content,
}: {
  conversationId: DirectMessagesConversations["id"];
  authorId: User["id"];
  content: string;
}) {
  return prisma.directMessages.create({
    data: {
      conversationId,
      authorId,
      content,
    },
  });
}

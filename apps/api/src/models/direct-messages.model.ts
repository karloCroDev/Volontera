// Database
import { prisma, User, DirectMessagesConversations } from "@repo/database";

export async function listAllDirectMessagesConversationService({
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
export async function updateDirectMessagesConversationLastMessageService({
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

export async function getDirectMessagesConversationByIdService({
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

export async function createDirectMessagesConversationService({
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

export async function createMessageInDirectMessagesConversationService({
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

export async function listAllUsers() {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
  });
}

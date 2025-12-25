// Database
import { prisma, User, DirectMessagesConversations } from "@repo/database";

export async function listAllDirectMessagesConversation(userId: User["id"]) {
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
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getDirectMessagesConversationById(
  conversationId: DirectMessagesConversations["id"]
) {
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

// TODO: Write some small algorithm to search all users by their username (first or last name) or email
export async function searchAllUsers(query: string) {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    where: {
      OR: [
        {
          firstName: query,
        },
        {
          lastName: query,
        },
      ],
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

// TODO: Handle this when I make implementation for sending the messages
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
export async function createDirectMessagesConversation({
  participantIds,
}: {
  participantIds: User["id"][];
}) {
  return prisma.directMessagesConversations.create({
    data: {
      pairKey: "ss",
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

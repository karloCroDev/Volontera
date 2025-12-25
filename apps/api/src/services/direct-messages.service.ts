// Models
import {
  getDirectMessagesConversationById,
  listAllDirectMessagesConversation,
  searchAllUsers,
} from "@/models/direct-messages.model";

// Database
import { User } from "@repo/database";

// Schemas
import {
  searchSchema,
  conversationSchema,
} from "@repo/schemas/direct-messages";

export async function searchAllUsersWithQuery({
  rawData,
}: {
  rawData: unknown;
}) {
  const { data, success } = searchSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot create notification",
        message: "Invalid data",
      },
    };
  }

  const users = await searchAllUsers(data.query);

  // TODO: Cache results with redis
  // TODO: When I implement the real search, make small algrithm
  // TODO: Pagniate this?
  const usersWithFullname = users.map((user) => {
    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  });

  return {
    status: 200,
    body: {
      title: "Users retrieved successfully",
      message: "Users retrieved successfully",
      users: usersWithFullname,
    },
  };
}

export async function listAllDirectMessagesConversationsService(
  userId: User["id"]
) {
  const conversations = await listAllDirectMessagesConversation(userId);

  const conversationsWithFullname = conversations.map((conversation) => {
    return {
      ...conversation,
      fullname: conversation.participants.map(
        (particpant) =>
          `${particpant.user.firstName} ${particpant.user.lastName}`
      ),
    };
  });

  return {
    status: 200,
    body: {
      title: "Direct messages conversations retrieved",
      message: "Direct messages conversations retrieved successfully",
      conversations: conversationsWithFullname,
    },
  };
}

export async function getDirectMessagesConversationByIdService(
  rawData: unknown
) {
  const { data, success } = conversationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot get conversation",
        message: "Invalid data",
      },
    };
  }

  const conversation = await getDirectMessagesConversationById(
    data.conversationId
  );

  const conversationWithFullname = {
    ...conversation,
    fullname: conversation?.participants.map(
      (conversation) =>
        `${conversation.user.firstName} ${conversation.user.lastName}`
    ),
  };

  return {
    status: 200,
    body: {
      title: "Direct messages conversation retrieved",
      message: "Direct messages conversation retrieved successfully",
      conversation: conversationWithFullname,
    },
  };
}

// export async function startConversationOrSendMessage({
//   rawData,
//   userId,
// }: {
//   rawData: unknown;
//   userId: User["id"];
// }) {
//   const { success, data } = messageSchema.safeParse(rawData);

//   if (!success) {
//     return {
//       status: 400,
//       body: {
//         title: "Invalid data, cannot create notification",
//         message: "Invalid data",
//       },
//     };
//   }

//   // TODO: This will need to be handled with prisma transactions

//   //   const createConversation = createDirectMessagesConversation({
//   //     participantIds: [userId, data.particpantId],
//   //   })
// }

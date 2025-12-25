// Models
import {
  getDirectMessagesConversationById,
  listAllDirectMessagesConversation,
  searchAllUsers,
  startConversationOrStartAndSendDirectMessage,
} from "@/models/direct-messages.model";
import { createUploadUrl } from "@/models/image.model";

// Database
import { User } from "@repo/database";

// Schemas
import {
  searchSchema,
  conversationSchema,
  messageSchema,
} from "@repo/schemas/direct-messages";

export async function searchAllUsersWithQueryService(rawData: unknown) {
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

  const users = await searchAllUsers({
    query: data.query,
    // limit: data.limit,
    // offset: data.offset,
  });

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

export async function startConversationOrStartAndSendDirectMessageService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = messageSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot create notification",
        message: "Invalid data",
      },
    };
  }

  // Presigned urls for images
  const images =
    data.image && data.image.length > 0
      ? await Promise.all(
          data.image.map(async (image) => {
            return await createUploadUrl({
              contentType: image.contentType,
              filename: image.filename,
              size: image.size,
            });
          })
        )
      : undefined;

  // TODO: Vidi je li trebam ionako ista vratiti na frontu
  const { conversation, message } =
    await startConversationOrStartAndSendDirectMessage({
      senderId: userId,
      receiverId: data.particpantId,
      content: data.content,
    });

  return {
    status: 200,
    body: {
      title: "Message is sent",
      message: "Message is successfully sent to the wanted user",
      images,
    },
  };
}

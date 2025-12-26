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

export async function searchAllUsersWithQueryService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
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

  const users = await searchAllUsers({
    query: data.query,
    userId,
    // limit: data.limit,
    // offset: data.offset,
  });

  // TODO: Cache results with redis
  // TODO: When I implement the real search, make small algrithm
  // TODO: Pagniate this?

  return {
    status: 200,
    body: {
      title: "Users retrieved successfully",
      message: "Users retrieved successfully",
      users,
    },
  };
}

export async function listAllDirectMessagesConversationsService(
  userId: User["id"]
) {
  const conversations = await listAllDirectMessagesConversation(userId);

  return {
    status: 200,
    body: {
      title: "Direct messages conversations retrieved",
      message: "Direct messages conversations retrieved successfully",
      conversations: conversations.map((conversation) => ({
        ...conversation,
        participant: conversation.participants.find(
          (participant) => participant.userId !== userId // Get the user that isn't the current user
        )!.user, // Get the user object
      })),
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

  return {
    status: 200,
    body: {
      title: "Direct messages conversation retrieved",
      message: "Direct messages conversation retrieved successfully",
      conversation: conversation,
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
    data.images && data.images.length > 0
      ? await Promise.all(
          data.images.map(async (image) => {
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
      conversationId: conversation.id,
    },
  };
}

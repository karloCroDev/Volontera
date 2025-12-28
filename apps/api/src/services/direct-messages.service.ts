// Models
import {
  getDirectMessagesConversationById,
  listAllDirectMessagesConversation,
  searchAllUsers,
  startConversationOrStartAndSendDirectMessage,
} from "@/models/direct-messages.model";
import { createUploadUrl } from "@/lib/aws-s3-functions";

// Database
import { User } from "@repo/database";

// Schemas
import {
  searchSchema,
  conversationSchema,
  createDirectMessageSchema,
  presignDirectMessageImagesSchema,
} from "@repo/schemas/direct-messages";
import { getReceiverSocketId, io } from "@/ws/socket";
import { EmitNewChat } from "@repo/types/sockets";

export async function presignDirectMessageImagesService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  // userId currently unused, but keeps auth context for future limits/rate-limits
  const { success, data } = presignDirectMessageImagesSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data",
        message: "Invalid data",
        success: false,
      },
    };
  }

  const images = await Promise.all(
    data.images.map(async (image) =>
      createUploadUrl({
        contentType: image.contentType,
        filename: image.filename,
        size: image.size,
      })
    )
  );

  return {
    status: 200,
    body: {
      title: "Presigned URLs",
      message: "Successfully generated presigned URLs",
      success: true,
      images,
    },
  };
}

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
          (participant) => participant.userId !== userId // Uzimam podatke od drugog korisnika (ne o sebi)
        )!.user,
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
      conversation,
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
  const { success, data } = createDirectMessageSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot create notification",
        message: "Invalid data",
      },
    };
  }

  // TODO: Vidi je li trebam ionako ista vratiti na frontu
  const { conversation, message } =
    await startConversationOrStartAndSendDirectMessage({
      senderId: userId,
      receiverId: data.particpantId,
      content: data.content,
      imageKeys: data.imageKeys,
    });

  const senderSocketId = getReceiverSocketId(userId);

  const receiverSocketId = getReceiverSocketId(data.particpantId);

  // Kreiranje poruke korisniku
  if (receiverSocketId)
    io.to(receiverSocketId).emit<EmitNewChat>("new-chat", message);

  // Kreiranje poruke sebi
  if (senderSocketId)
    io.to(senderSocketId).emit<EmitNewChat>("new-chat", message);

  return {
    status: 200,
    body: {
      title: "Message is sent",
      message: "Message is successfully sent to the wanted user",
      conversationId: conversation.id,
    },
  };
}

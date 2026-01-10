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

// Schema types
import {
  SearchArgs,
  ConversationArgs,
  CreateDirectMessageArgs,
} from "@repo/schemas/direct-messages";
import { PresignImagesSchemaArgs } from "@repo/schemas/image";

// Websockets
import { getReceiverSocketId, io } from "@/ws/socket";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

export async function presignDirectMessageImagesService({
  images: dataImages,
}: PresignImagesSchemaArgs) {
  const images = await Promise.all(
    dataImages.map(async (image) =>
      createUploadUrl({
        contentType: image.contentType,
        filename: image.filename,
        size: image.size,
      })
    )
  );

  return serverFetchOutput({
    status: 200,
    message: "Successfully generated presigned URLs",
    success: true,
    data: { images },
  });
}

export async function searchAllUsersWithQueryService({
  data,
  userId,
}: {
  data: SearchArgs;
  userId: User["id"];
}) {
  const users = await searchAllUsers({
    query: data.query,
    userId,
    // limit: data.limit,
    // offset: data.offset,
  });

  // TODO: Cache results with redis
  // TODO: When I implement the real search, make small algrithm
  // TODO: Pagniate this?

  return toastResponseOutput({
    status: 200,
    title: "Users retrieved successfully",
    message: "Users retrieved successfully",
    data: { users },
  });
}

export async function listAllDirectMessagesConversationsService(
  userId: User["id"]
) {
  const conversations = await listAllDirectMessagesConversation(userId);

  return toastResponseOutput({
    status: 200,
    title: "Direct messages conversations retrieved",
    message: "Direct messages conversations retrieved successfully",
    data: {
      conversations: conversations.map((conversation) => ({
        ...conversation,
        participant: conversation.participants.find(
          (participant) => participant.userId !== userId
        )!.user,
      })),
    },
  });
}

export async function getDirectMessagesConversationByIdService({
  conversationId,
}: ConversationArgs) {
  const conversation = await getDirectMessagesConversationById(conversationId);

  return toastResponseOutput({
    status: 200,
    message: "Conversation retrieved successfully",
    title: "Conversation retrieved successfully",
    data: { conversation },
  });
}

export async function startConversationOrStartAndSendDirectMessageService({
  userId,
  data,
}: {
  data: CreateDirectMessageArgs;
  userId: User["id"];
}) {
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

  // Prikazivanje poruke korisniku
  if (receiverSocketId) io.to(receiverSocketId).emit("new-chat", message);

  // Prikazivanje poruke sebi
  if (senderSocketId) io.to(senderSocketId).emit("new-chat", message);

  return toastResponseOutput({
    status: 200,
    title: "Message is sent",
    message: "Message is successfully sent to the wanted user",
    data: { conversationId: conversation.id },
  });
}

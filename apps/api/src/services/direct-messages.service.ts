// Models
import {
  deleteDirectMessageById,
  getDirectMessagesConversationById,
  listAllDirectMessagesConversation,
  searchAllUsers,
  startConversationOSendDirectMessage,
} from "@/models/direct-messages.model";

// Lib
import { createUploadUrl } from "@/lib/aws-s3-functions";

// Database
import { User } from "@repo/database";

// Schemas
import {
  SearchArgs,
  ConversationArgs,
  CreateDirectMessageArgs,
  DeleteDirectMessageArgs,
} from "@repo/schemas/direct-messages";
import { PresignImagesSchemaArgs } from "@repo/schemas/image";

// Websockets
import { getReceiverSocketId, io } from "@/ws/socket";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import { createNotification } from "@/models/notification.model";

export async function presignDirectMessageImagesService({
  images: dataImages,
}: PresignImagesSchemaArgs) {
  const images = await Promise.all(
    dataImages.map(async (image) =>
      createUploadUrl({
        contentType: image.contentType,
        filename: image.filename,
        size: image.size,
      }),
    ),
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
  });

  return toastResponseOutput({
    status: 200,
    title: "Users retrieved successfully",
    message: "Users retrieved successfully",
    data: { users },
  });
}

export async function listAllDirectMessagesConversationsService(
  userId: User["id"],
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
          (participant) => participant.userId !== userId,
        )!.user,
      })),
    },
  });
}

export async function getDirectMessagesConversationByIdService({
  data,
  userId,
}: {
  data: ConversationArgs;
  userId: User["id"];
}) {
  const conversation = await getDirectMessagesConversationById({
    recieverId: data.recieverId,
    senderId: userId,
  });

  return toastResponseOutput({
    status: 200,
    message: "Conversation retrieved successfully",
    title: "Conversation retrieved successfully",
    data: { directMessages: conversation?.directMessages || [] },
  });
}

export async function deleteDirectMessageByIdService({
  data,
  userId,
}: {
  data: DeleteDirectMessageArgs;
  userId: User["id"];
}) {
  const deletedMessage = await deleteDirectMessageById({
    messageId: data.messageId,
    userId,
  });

  // Oba dva korisnika pošaljem kako se izbrisala poruka
  deletedMessage.conversation.participants.forEach((participant) => {
    const participantSocketId = getReceiverSocketId(participant.userId);
    if (!participantSocketId) return;
    io.to(participantSocketId).emit("direct-messages:message-deleted", {
      messageId: deletedMessage.id,
    });
  });

  return toastResponseOutput({
    message: "Message deleted successfully",
    title: "Message deleted",
    status: 200,
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
  const { message } = await startConversationOSendDirectMessage({
    senderId: userId,
    recieverId: data.particpantId,
    content: data.content,
    imageKeys: data.imageKeys,
  });

  const senderSocketId = getReceiverSocketId(userId);

  const receiverSocketId = getReceiverSocketId(data.particpantId);

  // Prikazivanje poruke korisniku
  if (receiverSocketId) io.to(receiverSocketId).emit("new-chat", message);

  // Prikazivanje poruke sebi
  if (senderSocketId) io.to(senderSocketId).emit("new-chat", message);

  await createNotification({
    content: `New direct message from ${message.author.firstName} ${message.author.lastName}: ${data.content.substring(0, 20)}`,
    userId: data.particpantId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Message is sent",
    message: "Message is successfully sent to the wanted user",
  });
}

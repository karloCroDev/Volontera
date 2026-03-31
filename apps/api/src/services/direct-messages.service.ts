// Models
import {
  deleteDirectMessageById,
  getDirectMessagesConversationById,
  listAllDirectMessagesConversation,
  searchAllUsers,
  startConversationOSendDirectMessage,
  createDirectMessageReply,
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
  ReplyMessageArgs,
} from "@repo/schemas/direct-messages";
import { PresignImagesSchemaArgs } from "@repo/schemas/image";

// Websockets
import { getReceiverSocketId, io } from "@/ws/socket";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import { createNotification } from "@/models/notification.model";
import { resolveImageKeysToUrls } from "@/services/image.service";

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

  const directMessages = conversation?.directMessages || [];

  const imageKeys = directMessages
    .flatMap((m) => m.directMessagesImages.map((img) => img.imageUrl))
    .filter(Boolean);

  const urlsByKey = await resolveImageKeysToUrls(imageKeys);

  const enrichedMessages = directMessages.map((message) => ({
    ...message,
    directMessagesImages: message.directMessagesImages.flatMap((img) => {
      const presignedUrl = img.imageUrl ? urlsByKey[img.imageUrl] : null;
      if (!presignedUrl) return [];
      return [{ ...img, imageUrl: presignedUrl }];
    }),
  }));

  return toastResponseOutput({
    status: 200,
    message: "Conversation retrieved successfully",
    title: "Conversation retrieved successfully",
    data: { directMessages: enrichedMessages },
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

  // Oba dva korisnika pošaljem kako se izbrisala poruka (ili poruke ako sadrže reply koji odgovara na poruku)
  deletedMessage.participants.forEach((participant) => {
    const participantSocketId = getReceiverSocketId(participant.userId);
    if (!participantSocketId) return;
    io.to(participantSocketId).emit("direct-messages:message-deleted", {
      messageId: data.messageId,
      messageIds: deletedMessage.deletedMessageIds,
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

  const newMessageKeys = message.directMessagesImages
    .map((img) => img.imageUrl)
    .filter(Boolean);

  const newMessageUrlsByKey = await resolveImageKeysToUrls(newMessageKeys);

  const enrichedMessage = {
    ...message,
    directMessagesImages: message.directMessagesImages.flatMap((img) => {
      const presignedUrl = img.imageUrl
        ? newMessageUrlsByKey[img.imageUrl]
        : null;
      if (!presignedUrl) return [];
      return [{ ...img, imageUrl: presignedUrl }];
    }),
  };

  const senderSocketId = getReceiverSocketId(userId);

  const receiverSocketId = getReceiverSocketId(data.particpantId);

  // Prikazivanje poruke korisniku
  if (receiverSocketId)
    io.to(receiverSocketId).emit("new-chat", enrichedMessage);

  // Prikazivanje poruke sebi
  if (senderSocketId) io.to(senderSocketId).emit("new-chat", enrichedMessage);

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

export async function createDirectMessageReplyService({
  userId,
  data,
}: {
  data: ReplyMessageArgs;
  userId: User["id"];
}) {
  let createReplyResult: Awaited<ReturnType<typeof createDirectMessageReply>>;

  try {
    createReplyResult = await createDirectMessageReply({
      senderId: userId,
      parentMessageId: data.parentMessageId,
      content: data.content,
      imageKeys: data.imageKeys,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Parent message not found") {
      return toastResponseOutput({
        status: 404,
        title: "Reply target not found",
        message:
          "The message you are replying to was deleted. Please choose another message.",
      });
    }

    if (
      err instanceof Error &&
      err.message === "You are not allowed to reply in this conversation"
    ) {
      return toastResponseOutput({
        status: 403,
        title: "Reply denied",
        message: "You are not allowed to reply in this conversation.",
      });
    }

    throw err;
  }

  const { reply, participantIds } = createReplyResult;

  const replyImageKeys = reply.directMessagesImages
    .map((img) => img.imageUrl)
    .filter(Boolean);

  const replyUrlsByKey = await resolveImageKeysToUrls(replyImageKeys);

  const enrichedReply = {
    ...reply,
    directMessagesImages: reply.directMessagesImages.flatMap((img) => {
      const presignedUrl = img.imageUrl ? replyUrlsByKey[img.imageUrl] : null;
      if (!presignedUrl) return [];
      return [{ ...img, imageUrl: presignedUrl }];
    }),
  };

  participantIds.forEach((participantId) => {
    const participantSocketId = getReceiverSocketId(participantId);
    if (!participantSocketId) return;
    io.to(participantSocketId).emit("new-chat", enrichedReply);
  });

  const receiverUserId = participantIds.find(
    (participantId) => participantId !== userId,
  );
  if (receiverUserId) {
    await createNotification({
      content: `New direct message reply from ${reply.author.firstName} ${reply.author.lastName}: ${data.content.substring(0, 20)}`,
      userId: receiverUserId,
    });
  }

  return toastResponseOutput({
    status: 200,
    title: "Reply is sent",
    message: "Your reply has been sent successfully",
  });
}

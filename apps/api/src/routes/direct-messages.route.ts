// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  deleteDirectMessageByIdController,
  getDirectMessagesConversationByIdServiceController,
  listAllDirectMessagesConversationsController,
  searchAllUsersWithQueryController,
  startConversationOrStartAndSendDirectMessageController,
  createDirectMessageReplyController,
} from "@/controllers/direct-messages.controller";

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  searchSchema,
  conversationSchema,
  createDirectMessageSchema,
  deleteDirectMessageSchema,
  replyMessageSchema,
} from "@repo/schemas/direct-messages";

export const directMessagesRoutes = Router();

directMessagesRoutes.use(express.json());

directMessagesRoutes.get("/", listAllDirectMessagesConversationsController);

directMessagesRoutes.get(
  "/:recieverId",
  validate({
    schema: conversationSchema,
    responseOutput: "toast",
    type: "params",
  }),
  getDirectMessagesConversationByIdServiceController,
);

// Get the params from the url
directMessagesRoutes.get(
  "/search/:query",
  validate({
    schema: searchSchema,
    responseOutput: "toast",
    type: "params",
  }),
  searchAllUsersWithQueryController,
);

directMessagesRoutes.post(
  "/conversation/message",
  validate({
    schema: createDirectMessageSchema,
    responseOutput: "toast",
    type: "body",
  }),
  startConversationOrStartAndSendDirectMessageController,
);

directMessagesRoutes.post(
  "/conversation/reply",
  validate({
    schema: replyMessageSchema,
    responseOutput: "toast",
    type: "body",
  }),
  createDirectMessageReplyController,
);

directMessagesRoutes.delete(
  "/:conversationId/:messageId",
  validate({
    schema: deleteDirectMessageSchema,
    responseOutput: "toast",
    type: "params",
  }),
  deleteDirectMessageByIdController,
);

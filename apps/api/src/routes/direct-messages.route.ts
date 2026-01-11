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
} from "@/controllers/direct-messages.controller";
import { validate } from "@/middleware/validate.middleware";
import {
  searchSchema,
  conversationSchema,
  createDirectMessageSchema,
  deleteDirectMessageSchema,
} from "@repo/schemas/direct-messages";

export const directMessagesRoutes = Router();

directMessagesRoutes.use(express.json());

directMessagesRoutes.get("/", listAllDirectMessagesConversationsController);

directMessagesRoutes.get(
  "/:conversationId",
  validate({
    schema: conversationSchema,
    responseOutput: "toast",
    type: "params",
  }),
  getDirectMessagesConversationByIdServiceController
);

// Get the params from the url
directMessagesRoutes.get(
  "/search/:query",
  validate({
    schema: searchSchema,
    responseOutput: "toast",
    type: "params",
  }),
  searchAllUsersWithQueryController
);

directMessagesRoutes.post(
  "/conversation/message",
  validate({
    schema: createDirectMessageSchema,
    responseOutput: "toast",
    type: "body",
  }),
  startConversationOrStartAndSendDirectMessageController
);

directMessagesRoutes.delete(
  "/messageId",
  validate({
    schema: deleteDirectMessageSchema,
    responseOutput: "toast",
    type: "body",
  }),
  deleteDirectMessageByIdController
);

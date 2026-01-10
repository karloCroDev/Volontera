// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  getDirectMessagesConversationByIdServiceController,
  listAllDirectMessagesConversationsController,
  presignDirectMessageImagesController,
  searchAllUsersWithQueryController,
  startConversationOrStartAndSendDirectMessageController,
} from "@/controllers/direct-messages.controller";
import { validate } from "@/middleware/validate.middleware";
import {
  searchSchema,
  conversationSchema,
  createDirectMessageSchema,
  presignDirectMessageImagesSchema,
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

// Upload-first flow: get presigned PUT urls for images
directMessagesRoutes.post(
  "/presign-images",
  validate({
    schema: presignDirectMessageImagesSchema,
    responseOutput: "server",
    type: "body",
  }),
  presignDirectMessageImagesController
);

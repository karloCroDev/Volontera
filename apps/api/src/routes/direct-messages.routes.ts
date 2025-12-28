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

export const directMessagesRoutes = Router();

directMessagesRoutes.use(express.json());

directMessagesRoutes.get("/", listAllDirectMessagesConversationsController);

directMessagesRoutes.get(
  "/:conversationId",
  getDirectMessagesConversationByIdServiceController
);

// Get the params from the url
directMessagesRoutes.get("/search/:query", searchAllUsersWithQueryController);

directMessagesRoutes.post(
  "/conversation/message",
  startConversationOrStartAndSendDirectMessageController
);

// Upload-first flow: get presigned PUT urls for images
directMessagesRoutes.post(
  "/presign-images",
  presignDirectMessageImagesController
);

// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  getDirectMessagesConversationByIdServiceController,
  listAllDirectMessagesConversationsController,
  searchAllUsersWithQueryController,
  startConversationOrStartAndSendDirectMessageController,
} from "@/controllers/direct-messages.controller";

export const directMessagesRoutes = Router();

directMessagesRoutes.use(express.json());

directMessagesRoutes.get(
  "/direct-messages",
  listAllDirectMessagesConversationsController
);

directMessagesRoutes.get(
  "/direct-messages/:conversationId",
  getDirectMessagesConversationByIdServiceController
);

// Get the params from the url
directMessagesRoutes.get(
  "/direct-messages/search/:query",
  searchAllUsersWithQueryController
);

directMessagesRoutes.post(
  "/direct-messages/conversation/message",
  startConversationOrStartAndSendDirectMessageController
);

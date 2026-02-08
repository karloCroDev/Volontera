// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  addQuestionController,
  deleteHelpMessagesController,
  getHelpMessagesController,
} from "@/controllers/help.controller";

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import { helpConversationSchema } from "@repo/schemas/help";

export const helpRoutes = Router();

helpRoutes.use(express.json());

helpRoutes
  .route("/help-conversation")
  .get(getHelpMessagesController)
  .post(
    validate({
      schema: helpConversationSchema,
      responseOutput: "form",
      type: "body",
    }),
    addQuestionController,
  )
  .delete(deleteHelpMessagesController);

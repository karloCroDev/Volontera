// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  addQuestionController,
  deleteHelpMessagesController,
  getHelpMessagesController,
} from "@/controllers/help.controller";

export const helpRoutes = Router();

helpRoutes.use(express.json());

helpRoutes
  .route("/help-conversation")
  .get(getHelpMessagesController)
  .post(addQuestionController)
  .delete(deleteHelpMessagesController);

// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  addQuestionController,
  deleteHelpMessagesController,
  getHelpMessagesController,
} from "@/controllers/help.controller";

export const directMessagesRoutes = Router();

directMessagesRoutes.use(express.json());

directMessagesRoutes
  .route("/direct")
  .get(getHelpMessagesController)
  .post(addQuestionController)
  .delete(deleteHelpMessagesController);

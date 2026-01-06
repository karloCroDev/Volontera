// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createCommentController,
  createReplyController,
  deleteCommentController,
  deleteReplyController,
  toggleLikeCommentController,
  toggleLikeReplyController,
  retrieveCommentRepliesController,
} from "@/controllers/comment.controller";

export const commentRoutes = Router();

commentRoutes.use(express.json());

// TODO: This will be only accessible to admins of the organization, change this middleware
commentRoutes
  .route("/")
  .post(createCommentController)
  .delete(deleteCommentController)
  .patch(toggleLikeCommentController); // Toggle like for comment

commentRoutes
  .route("/reply/:replyId")
  .get(retrieveCommentRepliesController)
  .delete(deleteReplyController)
  .patch(toggleLikeReplyController);

commentRoutes.route("/reply").post(createReplyController);

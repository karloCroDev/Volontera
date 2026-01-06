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
  retrievePostCommentsController,
} from "@/controllers/comment.controller";

export const commentRoutes = Router();

commentRoutes.use(express.json());

commentRoutes.route("/:postId").get(retrievePostCommentsController);

commentRoutes
  .route("/:commentId")
  .delete(deleteCommentController)
  .patch(toggleLikeCommentController);

commentRoutes.post("/", createCommentController);

commentRoutes
  .route("/reply/:replyId")
  .delete(deleteReplyController)
  .patch(toggleLikeReplyController);

commentRoutes.route("/reply/:commentId").get(retrieveCommentRepliesController);
commentRoutes.route("/reply").post(createReplyController);

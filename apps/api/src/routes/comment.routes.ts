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

commentRoutes
  .route("/:postId")
  .get(retrievePostCommentsController)
  .delete(deleteCommentController)
  .patch(toggleLikeCommentController);

commentRoutes.post("/", createCommentController);

commentRoutes
  .route("/reply/:replyId")
  .get(retrieveCommentRepliesController)
  .delete(deleteReplyController)
  .patch(toggleLikeReplyController);

commentRoutes.route("/reply").post(createReplyController);

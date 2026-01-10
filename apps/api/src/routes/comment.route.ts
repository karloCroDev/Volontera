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

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  createCommentSchema,
  createReplySchema,
  deleteCommentSchema,
  deleteReplySchema,
  likeOrDislikeCommentSchema,
  likeOrDislikeReplySchema,
  retrieveCommentRepliesSchema,
  retrievePostCommentsSchema,
} from "@repo/schemas/comment";

export const commentRoutes = Router();

commentRoutes.use(express.json());

commentRoutes.route("/:postId").get(
  validate({
    schema: retrievePostCommentsSchema,
    responseOutput: "server",
    type: "params",
  }),
  retrievePostCommentsController
);

commentRoutes
  .route("/:commentId")
  .delete(
    validate({
      schema: deleteCommentSchema,
      responseOutput: "toast",
      type: "params",
    }),
    deleteCommentController
  )
  .patch(
    validate({
      schema: likeOrDislikeCommentSchema,
      responseOutput: "toast",
      type: "params",
    }),
    toggleLikeCommentController
  );

commentRoutes.post(
  "/",
  validate({
    schema: createCommentSchema,
    responseOutput: "toast",
    type: "body",
  }),
  createCommentController
);

commentRoutes
  .route("/reply/:replyId")
  .delete(
    validate({
      schema: deleteReplySchema,
      responseOutput: "toast",
      type: "params",
    }),
    deleteReplyController
  )
  .patch(
    validate({
      schema: likeOrDislikeReplySchema,
      responseOutput: "toast",
      type: "params",
    }),
    toggleLikeReplyController
  );

commentRoutes.route("/reply/:commentId").get(
  validate({
    schema: retrieveCommentRepliesSchema,
    responseOutput: "server",
    type: "params",
  }),
  retrieveCommentRepliesController
);

commentRoutes.route("/reply").post(
  validate({
    schema: createReplySchema,
    responseOutput: "toast",
    type: "body",
  }),
  createReplyController
);

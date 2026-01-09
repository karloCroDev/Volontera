// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createPostController,
  deletePostController,
  retrieveOrganizationPostsController,
  retrievePostDataController,
  retrievePostWithCommentsController,
  toggleLikePostController,
  updatePostController,
} from "@/controllers/post.controller";

// Middleware
import { organizationMiddleware } from "@/middleware/role-middleware";
import { validate } from "@/middleware/validate.middleware";

// Scheams
import {
  createPostSchema,
  deletePostSchema,
  retrievePost,
  updatePostSchema,
  likeOrDislikePostSchema,
  retrieveOrganizationPostsSchema,
} from "@repo/schemas/post";
import { retrievePostCommentsSchema } from "@repo/schemas/comment";

export const postRoutes = Router();

postRoutes.use(express.json());

// TODO: This will be only accessible to admins of the organization, change this middleware
postRoutes
  .route("/")
  .post(
    organizationMiddleware,
    validate({
      schema: createPostSchema,
      responseOutput: "form",
    }),
    createPostController
  )
  .delete(
    organizationMiddleware,
    validate({
      schema: deletePostSchema,
      responseOutput: "form",
    }),
    deletePostController
  )
  .patch(
    organizationMiddleware,
    validate({
      schema: updatePostSchema,
      responseOutput: "form",
      type: "body",
    }),
    updatePostController
  );

// TODO: Adjust this after the middleware and change it so that it has the same strucutre as in the comment routes
postRoutes.get(
  "/data/:postId",
  organizationMiddleware,
  validate({
    schema: retrievePost,
    responseOutput: "server",
    type: "params",
  }),
  retrievePostDataController
);

postRoutes.get(
  "/:organizationId",
  validate({
    schema: retrieveOrganizationPostsSchema,
    responseOutput: "server",
    type: "params",
  }),
  retrieveOrganizationPostsController
);

// Everyone
postRoutes.get(
  "/id/:postId",
  validate({
    schema: retrievePostCommentsSchema,
    responseOutput: "server",
    type: "params",
  }),
  retrievePostWithCommentsController
);

postRoutes.patch(
  "/toggle-like",
  validate({
    schema: likeOrDislikePostSchema,
    responseOutput: "server",
    type: "body",
  }),
  toggleLikePostController
);

// postRoutes.route('/home')

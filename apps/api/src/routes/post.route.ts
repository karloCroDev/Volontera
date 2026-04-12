// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createPostController,
  deletePostController,
  dislikePostController,
  likePostController,
  retrieveOrganizationPostsController,
  retrievePostDataController,
  retrievePostWithCommentsController,
  updatePostController,
} from "@/controllers/post.controller";

// Middleware
import { organizationMiddleware } from "@/middleware/role.middleware";
import { validate } from "@/middleware/validate.middleware";
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";

// Scheams
import {
  createPostSchema,
  deletePostSchema,
  dislikePostSchema,
  likePostSchema,
  retrievePost,
  updatePostSchema,
  retrieveOrganizationPostsSchema,
  retrieveOrganizationPostsQuerySchema,
} from "@repo/schemas/post";
import { retrievePostCommentsSchema } from "@repo/schemas/comment";

export const postRoutes = Router();

postRoutes.use(express.json());

postRoutes
  .route("/")
  .post(
    validate({
      schema: createPostSchema,
      responseOutput: "form",
    }),
    organizationRolesMiddleware({
      aquiredRoles: ["ADMIN", "OWNER"],
      type: "body",
    }),
    createPostController,
  )
  .delete(
    organizationRolesMiddleware({
      aquiredRoles: ["ADMIN", "OWNER"],
      type: "body",
    }),
    validate({
      schema: deletePostSchema,
      responseOutput: "form",
    }),
    deletePostController,
  )
  .patch(
    organizationRolesMiddleware({
      aquiredRoles: ["ADMIN", "OWNER"],
    }),
    validate({
      schema: updatePostSchema,
      responseOutput: "form",
      type: "body",
    }),
    updatePostController,
  );

postRoutes.get(
  "/data/:postId",
  organizationMiddleware,
  validate({
    schema: retrievePost,
    responseOutput: "server",
    type: "params",
  }),
  retrievePostDataController,
);

postRoutes.get(
  "/:organizationId",
  validate({
    schema: retrieveOrganizationPostsSchema,
    responseOutput: "server",
    type: "params",
  }),
  validate({
    schema: retrieveOrganizationPostsQuerySchema,
    responseOutput: "server",
    type: "query",
  }),
  retrieveOrganizationPostsController,
);

// Everyone
postRoutes.get(
  "/id/:postId",
  validate({
    schema: retrievePostCommentsSchema,
    responseOutput: "server",
    type: "params",
  }),
  retrievePostWithCommentsController,
);

postRoutes.patch(
  "/like",
  validate({
    schema: likePostSchema,
    responseOutput: "server",
    type: "body",
  }),
  likePostController,
);

postRoutes.patch(
  "/dislike",
  validate({
    schema: dislikePostSchema,
    responseOutput: "server",
    type: "body",
  }),
  dislikePostController,
);

// postRoutes.route('/home')

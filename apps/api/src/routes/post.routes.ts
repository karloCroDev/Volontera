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

import { organizationMiddleware } from "@/middleware/role-middleware";

export const postRoutes = Router();

postRoutes.use(express.json());

// TODO: This will be only accessible to admins of the organization, change this middleware
postRoutes
  .route("/")
  .post(organizationMiddleware, createPostController)
  .delete(organizationMiddleware, deletePostController)
  .patch(organizationMiddleware, updatePostController);

postRoutes.get(
  "/data/:postId",
  organizationMiddleware,
  retrievePostDataController
);

postRoutes.get("/:organizationId", retrieveOrganizationPostsController);

// Everyone
postRoutes.get("/id/:postId", retrievePostWithCommentsController);

postRoutes.patch("/like", likePostController);
postRoutes.patch("/dislike", dislikePostController);

// postRoutes.route('/home')

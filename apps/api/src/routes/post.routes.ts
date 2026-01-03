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
  retrievePostWithCommentsController,
} from "@/controllers/post.controller";
import { organizationMiddleware } from "@/middleware/role-middleware";

export const postRoutes = Router();

postRoutes.use(express.json());

// TODO: This will be only accessible to admins of the organization, change this middleware
postRoutes
  .route("/")
  .post(organizationMiddleware, createPostController)
  .delete(organizationMiddleware, deletePostController);

postRoutes.get("/:organizationId", retrieveOrganizationPostsController);

postRoutes.get("/id/:postId", retrievePostWithCommentsController);

postRoutes.patch("/like", likePostController);
postRoutes.patch("/dislike", dislikePostController);
// postRoutes.route('/home')

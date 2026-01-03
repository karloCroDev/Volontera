// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { createPostController } from "@/controllers/post.controller";
import { organizationMiddleware } from "@/middleware/role-middleware";

export const postRoutes = Router();

postRoutes.use(express.json());

// TODO: This will be only accessible to admins of the organization, change this middleware
postRoutes.route("/").post(organizationMiddleware, createPostController);

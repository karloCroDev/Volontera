// External packages
import express from "express";
import { Router } from "express";

// Controllers

import {
  logoutController,
  getUserByIdController,
  userSessionController,
  retrieveAllOrganizationsForUserController,
  retrieveAllPostsForUserController,
} from "@/controllers/user.controller";
import { validate } from "@/middleware/validate.middleware";
import { userSchema, UserSchemaArgs } from "@repo/schemas/user";
import { authMiddleware } from "@/middleware/auth.middleware";

export const userRoutes = Router();

userRoutes.use(express.json());

userRoutes.get(
  "/id/:userId",
  authMiddleware,
  validate({
    schema: userSchema,
    type: "params",
    responseOutput: "server",
  }),
  getUserByIdController,
);
userRoutes.get(
  "/organizations/:userId",
  authMiddleware,
  validate({
    schema: userSchema,
    type: "params",
    responseOutput: "server",
  }),
  retrieveAllOrganizationsForUserController,
);
userRoutes.get(
  "/posts/:userId",
  authMiddleware,
  validate({
    schema: userSchema,
    type: "params",
    responseOutput: "server",
  }),
  retrieveAllPostsForUserController,
);
userRoutes.get("/session", authMiddleware, userSessionController);
userRoutes.post("/logout", authMiddleware, logoutController);

// External packages
import express from "express";
import { Router } from "express";

// Controllers

import {
  logoutController,
  getUserByIdController,
  userSessionController,
  retrieveAllOrganizationsForUserController,
} from "@/controllers/user.controller";
import { validate } from "@/middleware/validate.middleware";
import { userSchema, UserSchemaArgs } from "@repo/schemas/user";

export const userRoutes = Router();

userRoutes.use(express.json());

userRoutes.get(
  "/id/:userId",
  validate({
    schema: userSchema,
    type: "params",
    responseOutput: "server",
  }),
  getUserByIdController
);
userRoutes.get(
  "/organizations/:userId",
  validate({
    schema: userSchema,
    type: "params",
    responseOutput: "server",
  }),
  retrieveAllOrganizationsForUserController
);
userRoutes.get("/posts/:userId", getUserByIdController);
userRoutes.get("/session", userSessionController);
userRoutes.post("/logout", logoutController);

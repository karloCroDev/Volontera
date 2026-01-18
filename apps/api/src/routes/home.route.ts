// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { retrieveRecentAlgoPostsController } from "@/controllers/home.controller";

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import { retrieveAlgoPostsSchema } from "@repo/schemas/home";

export const homeRoute = Router();

homeRoute.use(express.json());

homeRoute.get(
  "/posts",
  validate({
    schema: retrieveAlgoPostsSchema,
    responseOutput: "server",
    type: "query",
  }),
  retrieveRecentAlgoPostsController,
);

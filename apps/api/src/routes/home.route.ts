// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  retrieveRecentAlgoPostsController,
  retrieveRecentFollowedAlgoPostsController,
} from "@/controllers/home.controller";
import { validate } from "@/middleware/validate.middleware";
import {
  retrieveFollowedAlgoPostsSchema,
  retrieveAlgoPostsSchema,
} from "@repo/schemas/home";

export const homeRoute = Router();

homeRoute.use(express.json());

homeRoute.route("/following").get(
  validate({
    schema: retrieveFollowedAlgoPostsSchema,
    responseOutput: "server",
    type: "query",
  }),
  retrieveRecentFollowedAlgoPostsController
);

homeRoute.get(
  "/home-posts",
  validate({
    schema: retrieveAlgoPostsSchema,
    responseOutput: "server",
    type: "query",
  }),
  retrieveRecentAlgoPostsController
);

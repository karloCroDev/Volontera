// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { searchUsersController } from "@/controllers/search.controller";
import { validate } from "@/middleware/validate.middleware";
import { searchUserSchema } from "@repo/schemas/search";

export const searchRoutes = Router();

searchRoutes.use(express.json());

searchRoutes.get(
  "/:query",
  validate({
    schema: searchUserSchema,
    responseOutput: "form",
    type: "params",
  }),
  searchUsersController
);

// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { getImageFromKeyController } from "@/controllers/image.controller";
import { imageKeysSchema } from "@repo/schemas/image";
import { validate } from "@/middleware/validate.middleware";

export const imageRoutes = Router();

imageRoutes.use(express.json());

imageRoutes.post(
  "/get-url-from-keys",
  validate({
    schema: imageKeysSchema,
    responseOutput: "toast",
  }),
  getImageFromKeyController
);

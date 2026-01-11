// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  getImageFromKeyController,
  presignDirectMessageImagesController,
} from "@/controllers/image.controller";

// Schemas
import { imageKeysSchema, presignImagesSchema } from "@repo/schemas/image";

// Middleware
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

imageRoutes.post(
  "/presign-images",
  validate({
    schema: presignImagesSchema,
    responseOutput: "toast",
  }),
  presignDirectMessageImagesController
);

// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().max(200),
  images: uploadImageSchema.shape.image
    .array()
    .min(1, "Please upload at least one image"),
  organizationId: z.cuid(),
});

export type CreatePostArgs = z.infer<typeof createPostSchema>;

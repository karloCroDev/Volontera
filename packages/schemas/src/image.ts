// External packages
import { z } from "zod";

export const imageKeysSchema = z.object({
  imageUrls: z.array(z.string()),
});

export type ImageKeysSchemaArgs = z.infer<typeof imageKeysSchema>;

export const uploadImageSchema = z.object({
  image: z.object({
    filename: z.string(),
    contentType: z.string(),
    size: z.number(),
  }),
});

export type UploadImageArgs = z.infer<typeof uploadImageSchema>;

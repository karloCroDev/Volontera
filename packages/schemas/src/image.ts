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

// Kada uploadam slike za direct message, prvo trazim presign URL-ove (ovo je napravljeno posebno zbog web socketa, kako bi se i isto vremeno moglo slati slike) pa onda ws stavljam slike u poruku
export const presignImagesSchema = z.object({
  images: uploadImageSchema.shape.image.array().min(1),
});

export type PresignImagesSchemaArgs = z.infer<typeof presignImagesSchema>;

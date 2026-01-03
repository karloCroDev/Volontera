// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

// Search field
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  // TODO: See if I am going to implement offset and limit for pagination or cursor based pagination
  // offset: z.number().default(0),
  // limit: z.number().default(20),
});

export type SearchArgs = z.infer<typeof searchSchema>;

export const messageSchema = z.object({
  content: z.string().min(1).max(200),
  particpantId: z.cuid(),
  images: uploadImageSchema.shape.image.array().optional(),
});

export type MessageArgs = z.infer<typeof messageSchema>;

// Kada uploadam slike za direct message, prvo trazim presign URL-ove, pa onda ws stavljam slike u poruku
export const presignDirectMessageImagesSchema = z.object({
  images: uploadImageSchema.shape.image.array().min(1),
});

export type PresignDirectMessageImagesArgs = z.infer<
  typeof presignDirectMessageImagesSchema
>;

// Upload-first: create message that references already-uploaded image keys
export const createDirectMessageSchema = z.object({
  content: z.string().min(1).max(200),
  particpantId: z.cuid(),
  imageKeys: z.array(z.string()).optional(),
});

export type CreateDirectMessageArgs = z.infer<typeof createDirectMessageSchema>;

export const conversationSchema = z.object({
  conversationId: z.cuid(),
});

export type ConversationArgs = z.infer<typeof conversationSchema>;

// External packages
import { z } from "zod";

// Search field
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  // TODO: See if I am going to implement offset and limit for pagination or cursor based pagination
  // offset: z.number().default(0),
  // limit: z.number().default(20),
});

export type SearchArgs = z.infer<typeof searchSchema>;

// Message field
export const directMessageImageMetaSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(200),
  particpantId: z.cuid(),
  // Client-side composer payload (used for presigning + upload)
  images: directMessageImageMetaSchema.array().optional(),
});

export type MessageArgs = z.infer<typeof messageSchema>;

// Upload-first: presign PUT urls for images
export const presignDirectMessageImagesSchema = z.object({
  images: directMessageImageMetaSchema.array().min(1),
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

// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

export type SearchArgs = z.infer<typeof searchSchema>;

export const messageSchema = z.object({
  content: z.string().min(1).max(200),
  particpantId: z.cuid(),
  images: uploadImageSchema.shape.image.array().optional(),
});

export type MessageArgs = z.infer<typeof messageSchema>;

export const createDirectMessageSchema = z.object({
  content: z.string().min(1).max(200),
  particpantId: z.cuid(),
  imageKeys: z.array(z.string()).optional(),
});
export type CreateDirectMessageArgs = z.infer<typeof createDirectMessageSchema>;

export const conversationSchema = z.object({
  recieverId: z.cuid(),
});
export type ConversationArgs = z.infer<typeof conversationSchema>;

export const deleteDirectMessageSchema = z.object({
  conversationId: z.cuid(),
  messageId: z.cuid(),
});
export type DeleteDirectMessageArgs = z.infer<typeof deleteDirectMessageSchema>;

export const replyMessageSchema = z.object({
  conversationId: z.cuid(),
  content: z.string().min(1).max(200),
  parentMessageId: z.cuid(),
  imageKeys: z.array(z.string()).optional(),
});
export type ReplyMessageArgs = z.infer<typeof replyMessageSchema>;

export const createReplySchema = z.object({
  conversationId: z.cuid(),
  content: z.string().min(1).max(200),
  parentMessageId: z.cuid(),
  images: uploadImageSchema.shape.image.array().optional(),
});
export type CreateReplyArgs = z.infer<typeof createReplySchema>;

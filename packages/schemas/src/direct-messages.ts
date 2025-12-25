// External packages
import { z } from "zod";

// Search field
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

export type SearchArgs = z.infer<typeof searchSchema>;

// Message field
export const messageSchema = z.object({
  content: z.string().min(1).max(200),
  conversationId: z.cuid(),
  particpantId: z.cuid(),
  // image: z.object({
  //   filename: z.string(),
  //   contentType: z.string(),
  //   size: z.number(),
  // }),
});

export type MessageArgs = z.infer<typeof messageSchema>;

export const conversationSchema = z.object({
  conversationId: z.cuid(),
});

export type ConversationArgs = z.infer<typeof conversationSchema>;

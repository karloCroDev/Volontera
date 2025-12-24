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
  image: z.object({
    filename: z.string(),
    contentType: z.string(),
    size: z.number(),
  }),
});

export type MessageArgs = z.infer<typeof messageSchema>;

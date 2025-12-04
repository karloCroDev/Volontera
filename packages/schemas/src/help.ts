// External packages
import { z } from "zod";

export const helpConversationSchema = z.object({
  message: z.string().min(2),
});
export type HelpConversationSchemaArgs = z.infer<typeof helpConversationSchema>;

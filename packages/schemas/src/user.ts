// Exteral packages
import { z } from "zod";

export const userSchema = z.object({
  userId: z.cuid(),
});
export type UserSchemaArgs = z.infer<typeof userSchema>;

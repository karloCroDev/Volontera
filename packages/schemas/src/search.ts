// External packages
import { z } from "zod";

export const searchUserSchema = z.object({
  query: z.string().min(1, "Query must be at least 1 character long"),
});

export type SearchUserArgs = z.infer<typeof searchUserSchema>;

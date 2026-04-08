// External packages
import { z } from "zod";

const coerceFirstQueryValue = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (Array.isArray(value)) return value[0];
    return value;
  }, schema);

export const retrieveAlgoPostsSchema = z.object({
  filter: z.enum(["following"]).optional(),
  cursor: coerceFirstQueryValue(z.string().min(1).optional()),
  limit: coerceFirstQueryValue(
    z.coerce.number().int().min(1).max(100).optional().default(10),
  ),
});
export type RetrieveAlgoPostsSchemaArgs = z.infer<
  typeof retrieveAlgoPostsSchema
>;

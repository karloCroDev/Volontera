// External packages
import { z } from "zod";

const coerceFirstQueryValue = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (Array.isArray(value)) return value[0];
    return value;
  }, schema);

const paginationSchema = z.object({
  offset: coerceFirstQueryValue(
    z.coerce.number().int().min(0).optional().default(0),
  ),
  limit: coerceFirstQueryValue(
    z.coerce.number().int().min(1).max(100).optional().default(10),
  ),
});

export const retrieveAlgoPostsSchema = z
  .object({
    filter: z.enum(["following"]).optional(),
  })
  .extend(paginationSchema.shape);
export type RetrieveAlgoPostsSchemaArgs = z.infer<
  typeof retrieveAlgoPostsSchema
>;

// External packages
import { z } from "zod";

const coerceFirstQueryValue = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (Array.isArray(value)) return value[0];
    return value;
  }, schema);

export const paginationSchema = z.object({
  offset: coerceFirstQueryValue(
    z.coerce.number().int().min(0).optional().default(0),
  ),
  limit: coerceFirstQueryValue(
    z.coerce.number().int().min(1).max(100).optional().default(10),
  ),
});

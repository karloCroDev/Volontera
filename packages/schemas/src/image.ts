// External packages
import { z } from "zod";

export const imageKeysSchema = z.object({
  imageUrls: z.array(z.string()),
});

export type ImageKeysSchemaArgs = z.infer<typeof imageKeysSchema>;

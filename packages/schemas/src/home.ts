// External packages
import { paginationSchema } from "./pagination";
import { z } from "zod";

export const retrieveAlgoPostsSchema = z
  .object({
    filter: z.enum(["following"]).optional(),
  })
  .extend(paginationSchema.shape);
export type RetrieveAlgoPostsSchemaArgs = z.infer<
  typeof retrieveAlgoPostsSchema
>;

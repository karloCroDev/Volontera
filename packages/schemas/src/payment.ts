// External packages
import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  priceId: z.string(),
});

export type CreateCheckoutSessionArgs = z.infer<
  typeof createCheckoutSessionSchema
>;

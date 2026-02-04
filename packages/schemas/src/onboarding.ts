// External packages
import { z } from "zod";

export const additionalInformationSchema = z
  .object({
    image: z
      .object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
        // deleteImage: z.url().or(z.literal("")).optional(),
      })
      .or(z.literal(undefined)),
    DOB: z.string().or(z.literal("")),
    bio: z
      .string()
      .min(2, "Bio must be at least 2 characters")
      .or(z.literal("")),
  })
  .partial()
  .refine(
    (obj) => Object.values(obj).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be provided", path: ["root"] },
  );

export type AdditionalFormArgs = z.infer<typeof additionalInformationSchema>;

export const appTypeSchema = z.object({
  appType: z.enum(["USER", "ORGANIZATION"]),
});
export type AppTypeSchemaArgs = z.infer<typeof appTypeSchema>;

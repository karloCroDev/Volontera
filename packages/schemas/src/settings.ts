// External packages
import { z } from "zod";

export const settingsSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters and max of 8")
      .max(8)
      .or(z.literal("")), // CLUTCH

    password: z
      .string()
      .min(8, "Password must be at least 8 characters and max of 16")
      .max(16)
      .or(z.literal("")),
    bio: z
      .string()
      .min(2, "Bio must be at least 2 characters and max of 10")
      .max(10)
      .or(z.literal("")),
    image: z.object({
      filename: z.string(),
      contentType: z.string(),
      size: z.number(),
    }),
    deleteImage: z.url().or(z.literal("")),
  })
  .partial()
  .refine(
    (obj) => Object.values(obj).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be provided", path: ["root"] }
  );

export type SettingsArgs = z.infer<typeof settingsSchema>;

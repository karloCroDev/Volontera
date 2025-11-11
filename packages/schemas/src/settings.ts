// External packages
import { z } from "zod";

export const settingsSchema = z
  .object({
    firstName: z.string().min(2).max(8).or(z.literal("")), // CLUTCH
    lastName: z.string().min(2).max(8).or(z.literal("")), // CLUTCH

    image: z.object({
      filename: z.string(),
      contentType: z.string(),
      size: z.number(),
    }),
    deleteImage: z.url().or(z.literal("")),
    DOB: z.string().length(10).or(z.literal("")),
    bio: z.string().min(2).max(10).or(z.literal("")),
    workOrSchool: z.string().min(2).max(20).or(z.literal("")),
  })
  .partial()
  .refine(
    (obj) => Object.values(obj).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be provided", path: ["root"] }
  );

export type SettingsSchemaArgs = z.infer<typeof settingsSchema>;

export const resetPasswordSettingsSchema = z
  .object({
    currentPassword: z.string().min(8).max(16),
    repeatCurrentPassword: z.string().min(8).max(8),
    newPassword: z.string("Enter ").min(8).max(8),
  })
  .refine((data) => data.currentPassword === data.repeatCurrentPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type ResetPasswordSettingsSchemaArgs = z.infer<
  typeof resetPasswordSettingsSchema
>;

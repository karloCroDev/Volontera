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
      deleteImage: z.string().or(z.literal("")).optional(),
    }),
    DOB: z.string().or(z.literal("")),
    bio: z.string().min(2).or(z.literal("")),
    workOrSchool: z.string().min(2).max(20).or(z.literal("")),
    address: z.string().min(2).max(50).or(z.literal("")),
  })
  .partial()
  .refine(
    (obj) => Object.values(obj).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be provided", path: ["root"] },
  );

export type SettingsArgs = z.infer<typeof settingsSchema>;

export const resetPasswordSettingsSchema = z
  .object({
    currentPassword: z.string().min(8).max(16),
    newPassword: z.string().min(8).max(16),
    repeatNewPassword: z.string().min(8).max(16),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords do not match",
    path: ["repeatNewPassword"],
  });

export type ResetPasswordSettingsArgs = z.infer<
  typeof resetPasswordSettingsSchema
>;

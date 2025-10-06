import { SettingsArgs } from "@repo/schemas/settings";

export type SettingsResponse = {
  success: boolean;
  message: string;
  presignedUrl?: string;
} & { errors?: Record<keyof SettingsArgs, string> };

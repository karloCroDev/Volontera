// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  changeProfileInfo,
  deleteAccount,
  resetPasswordInApp,
} from "@/controllers/settings.controller";

// Schemas
import {
  resetPasswordSettingsSchema,
  settingsSchema,
} from "@repo/schemas/settings";

// Middleware
import { validate } from "@/middleware/validate.middleware";

export const settingsRoutes = Router();

settingsRoutes.use(express.json());

settingsRoutes.patch(
  "/change-profile-info",
  validate({
    schema: settingsSchema,
    responseOutput: "toast",
  }),
  changeProfileInfo
);

settingsRoutes.post(
  "/reset-password-in-app",
  validate({
    schema: resetPasswordSettingsSchema,
    responseOutput: "form",
  }),
  resetPasswordInApp
);
settingsRoutes.delete("/delete-account", deleteAccount);

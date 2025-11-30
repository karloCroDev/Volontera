// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  changeProfileInfo,
  resetPasswordInApp,
} from "@/controllers/settings.controller";

export const settingsRoutes = Router();

settingsRoutes.use(express.json());

settingsRoutes.patch("/change-profile-info", changeProfileInfo);
settingsRoutes.post("/reset-password-in-app", resetPasswordInApp);

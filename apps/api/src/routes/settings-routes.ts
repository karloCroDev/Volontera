// External packages
import express from "express";
import { Router } from "express";

// Middleware
import { additionalInformationMiddleware } from "@/middleware/onbaording-middleware";

// Controllers
import { appType } from "@/controllers/onboaridng.controller";
import { changeProfileInfo } from "@/controllers/settings.controller";

export const settingsRoutes = Router();

settingsRoutes.use(express.json());

settingsRoutes.patch("/change-profile-info", changeProfileInfo);

// External packages
import express from "express";
import { Router } from "express";

// Middleware
import { hasRoleMiddleware } from "@/middleware/role-middleware";

// Controllers
import {
  additionalInformation,
  skipAdditionalInformation,
  appType,
} from "@/controllers/onboaridng.controller";

export const onboardingRoutes = Router();

onboardingRoutes.use(express.json());

onboardingRoutes.post("/app-type", express.text(), appType);
onboardingRoutes.post(
  "/additional-information",
  hasRoleMiddleware,
  additionalInformation
);
onboardingRoutes.post(
  "/skip-additional-information",
  hasRoleMiddleware,
  skipAdditionalInformation
);

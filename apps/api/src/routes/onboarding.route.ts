// External packages
import express from "express";
import { Router } from "express";

// Middleware
import { hasRoleMiddleware } from "@/middleware/role.middleware";

// Controllers
import {
  additionalInformation,
  skipAdditionalInformation,
  appType,
} from "@/controllers/onboarding.controller";

// Schemas
import {
  additionalInformationSchema,
  appTypeSchema,
} from "@repo/schemas/onboarding";
import { validate } from "@/middleware/validate.middleware";

export const onboardingRoutes = Router();

onboardingRoutes.use(express.json());

onboardingRoutes.post(
  "/app-type",
  validate({
    schema: appTypeSchema,
    responseOutput: "toast",
  }),
  appType
);
onboardingRoutes.post(
  "/additional-information",
  hasRoleMiddleware,
  validate({
    schema: additionalInformationSchema,
    responseOutput: "form",
  }),
  additionalInformation
);
onboardingRoutes.post(
  "/skip-additional-information",
  hasRoleMiddleware,
  validate({
    schema: appTypeSchema,
    responseOutput: "toast",
  }),
  skipAdditionalInformation
);

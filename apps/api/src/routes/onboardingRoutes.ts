// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  addtionalInformation,
  skipAdditionalInformation,
} from "@/controllers/onboarding/additional-info";
import { appType } from "@/controllers/onboarding/app-type";
import { additionalInformationMiddleware } from "@/middleware/onboardingMiddleware";

export const onboardingRoutes = Router();

onboardingRoutes.use(express.json());
onboardingRoutes.use(express.text());

onboardingRoutes.post("/app-type", appType);
onboardingRoutes.post(
  "/additional-information",
  additionalInformationMiddleware,
  addtionalInformation
);
onboardingRoutes.post(
  "/skip-additional-information",
  additionalInformationMiddleware,
  skipAdditionalInformation
);

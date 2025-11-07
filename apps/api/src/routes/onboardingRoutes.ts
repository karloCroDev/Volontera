// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { addtionalInformation } from "@/controllers/onboarding/additional-info";
import { appType } from "@/controllers/onboarding/app-type";
import { onbaordingMiddleware } from "@/middleware/onbaordingMiddleware";
import { app } from "@/config/socket";

export const onboardingRoutes = Router();

onboardingRoutes.use(express.json());
onboardingRoutes.use(express.text());

onboardingRoutes.post("/app-type", appType);
onboardingRoutes.post("/additional-information", addtionalInformation);

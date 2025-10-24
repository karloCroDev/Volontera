// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { addtionalInformation } from "@/controllers/onboarding/additional-info";
import { appType } from "@/controllers/onboarding/app-type";

export const onboardingRoutes = Router();

onboardingRoutes.use(express.json());

onboardingRoutes.post("/app-type", appType);
onboardingRoutes.post("/additional-information", addtionalInformation);

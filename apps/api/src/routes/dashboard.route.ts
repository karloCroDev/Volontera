// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { retrieveKPIMetricsController } from "@/controllers/dashboard.controller";

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import { dashboardKPIMetricsQuerySchema } from "@repo/schemas/dashboard";

export const dashboardRoutes = Router();

dashboardRoutes.use(express.json());

dashboardRoutes.get(
  "/",
  validate({
    schema: dashboardKPIMetricsQuerySchema,
    type: "query",
    responseOutput: "server",
  }),
  retrieveKPIMetricsController,
);

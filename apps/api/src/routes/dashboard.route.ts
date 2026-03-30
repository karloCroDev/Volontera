// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  banUserController,
  retrieveKPIMetricsController,
  retrievePaginatedUsersController,
  unbanUserController,
} from "@/controllers/dashboard.controller";

// Middleware
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  dashboardKPIMetricsQuerySchema,
  dashboardUsersPaginationQuerySchema,
} from "@repo/schemas/dashboard";
import { userSchema } from "@repo/schemas/user";

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

dashboardRoutes.get(
  "/users",
  validate({
    schema: dashboardUsersPaginationQuerySchema,
    type: "query",
    responseOutput: "server",
  }),
  retrievePaginatedUsersController,
);

dashboardRoutes.post(
  "/users/ban",
  validate({
    schema: userSchema,
    responseOutput: "toast",
  }),
  banUserController,
);

dashboardRoutes.post(
  "/users/unban",
  validate({
    schema: userSchema,
    responseOutput: "toast",
  }),
  unbanUserController,
);

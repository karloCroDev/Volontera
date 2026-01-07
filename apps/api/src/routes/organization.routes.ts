// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationController,
  getOrganizationDetailsByIdController,
  listOrganizationsOrganizatorController,
  listOrganizationsUserController,
  sendRequestToJoinOrganizationController,
} from "@/controllers/organization.controller";

// Middleware
import {
  organizationMiddleware,
  userMiddleware,
} from "@/middleware/role-middleware";

export const organizationRoutes = Router();

organizationRoutes.use(express.json());

// Organizator only
organizationRoutes.post(
  "/create-organization",
  organizationMiddleware,
  createOrganizationController
);
organizationRoutes.get(
  "/list-organizations-organizator",
  organizationMiddleware,
  listOrganizationsOrganizatorController
);

// User only
organizationRoutes.get(
  "/list-organizations-user",
  userMiddleware,
  listOrganizationsUserController
);

// Everyone
// TODO: Set this with id, so that it doesn't mess with other routes
organizationRoutes.get(
  "/id/:organizationId",
  getOrganizationDetailsByIdController
);

organizationRoutes.post(
  "/send-request-to-join-organization",
  userMiddleware,
  sendRequestToJoinOrganizationController
);

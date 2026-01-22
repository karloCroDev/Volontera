// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationController,
  toggleFollowOrganizationController,
  getOrganizationDetailsByIdController,
  listOrganizationsOrganizatorController,
  listOrganizationsUserController,
  sendRequestToJoinOrganizationController,
} from "@/controllers/organization.controller";

// Middleware
import {
  organizationMiddleware,
  userMiddleware,
} from "@/middleware/role.middleware";
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  getOrganizationDetailsByIdSchema,
  createOrganizationSchema,
  sendRequestToJoinOrganizationSchema,
  toggleFollowOrganizationSchema,
} from "@repo/schemas/organization";

export const organizationRoutes = Router();

organizationRoutes.use(express.json());

// Organizator only
organizationRoutes.post(
  "/create-organization",
  organizationMiddleware,
  validate({
    schema: createOrganizationSchema,
    responseOutput: "form",
  }),
  createOrganizationController,
);
organizationRoutes.get(
  "/list-organizations-organizator",
  organizationMiddleware,
  listOrganizationsOrganizatorController,
);

// User only
organizationRoutes.get(
  "/list-organizations-user",
  userMiddleware,
  listOrganizationsUserController,
);

// Everyone
organizationRoutes.get(
  "/id/:organizationId",
  validate({
    schema: getOrganizationDetailsByIdSchema,
    responseOutput: "server",
    type: "params",
  }),
  getOrganizationDetailsByIdController,
);

organizationRoutes.post(
  "/send-request-to-join-organization",
  userMiddleware,
  validate({
    schema: sendRequestToJoinOrganizationSchema,
    responseOutput: "form",
  }),
  sendRequestToJoinOrganizationController,
);

organizationRoutes.post(
  "/toggle-follow/:organizationId",
  validate({
    schema: toggleFollowOrganizationSchema,
    responseOutput: "toast",
    type: "params",
  }),
  toggleFollowOrganizationController,
);

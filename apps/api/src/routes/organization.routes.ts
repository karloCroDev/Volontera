// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationController,
  getOrganizationDetailsByIdController,
  listOrganizationsOrganizatorController,
  listOrganizationsUserController,
} from "@/controllers/organization.controller";

export const organizationRoutes = Router();

organizationRoutes.use(express.json());

organizationRoutes.post("/create-organization", createOrganizationController);
organizationRoutes.get(
  "/list-organizations-organizator",
  listOrganizationsOrganizatorController
);
organizationRoutes.get(
  "/list-organizations-user",
  listOrganizationsUserController
);

// TODO: Set this with id, so that it doesn't mess with other routes
organizationRoutes
  .route("/:organizationId")
  .get(getOrganizationDetailsByIdController);

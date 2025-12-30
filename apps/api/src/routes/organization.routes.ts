// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationController,
  getOrganizationDetailsByIdController,
} from "@/controllers/organization.controller";

export const organizationRoutes = Router();

organizationRoutes.use(express.json());

organizationRoutes.post("/create-organization", createOrganizationController);
organizationRoutes
  .route("/:organizationId")
  .get(getOrganizationDetailsByIdController);

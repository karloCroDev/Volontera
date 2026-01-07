// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  retrieveAllRequestsToJoinOrganizationController,
  retrieveAllUsersInOrganizationController,
  retrieveOrganizationMemberController,
} from "@/controllers/organization-managment.controller";

// Middleware
import {
  organizationMiddleware,
  userMiddleware,
} from "@/middleware/role-middleware";

export const organizationManagmentRoutes = Router();

organizationManagmentRoutes.use(express.json());

// TODO: Change these middlewares

organizationManagmentRoutes.get(
  "/requests",
  organizationMiddleware,
  retrieveAllRequestsToJoinOrganizationController
);

organizationManagmentRoutes.get(
  "/users",
  organizationMiddleware,
  retrieveAllUsersInOrganizationController
);
organizationManagmentRoutes.get(
  "/member",
  organizationMiddleware,
  retrieveOrganizationMemberController
);

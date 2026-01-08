// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  retrieveAllRequestsToJoinOrganizationController,
  retrieveAllUsersInOrganizationController,
  retrieveOrganizationMemberController,
  acceptOrDeclineUsersRequestToJoinOrganizationController,
  demoteOrPromoteOrganizationMemberController,
} from "@/controllers/organization-managment.controller";

// Middleware

import { organizationRolesMiddleware } from "@/middleware/organization-roles-middleware";

export const organizationManagmentRoutes = Router();

organizationManagmentRoutes.use(express.json());

organizationManagmentRoutes.get(
  "/requests/:organizationId",
  organizationRolesMiddleware(),
  retrieveAllRequestsToJoinOrganizationController
);

organizationManagmentRoutes.get(
  "/users/:organizationId",
  organizationRolesMiddleware(),
  retrieveAllUsersInOrganizationController
);
organizationManagmentRoutes.get(
  "/member/:organizationId",
  organizationRolesMiddleware(),
  retrieveOrganizationMemberController
);

organizationManagmentRoutes.post(
  "/accept-decline-request",
  organizationRolesMiddleware(),
  acceptOrDeclineUsersRequestToJoinOrganizationController
);

organizationManagmentRoutes.post(
  "/demote-promote-member",
  organizationRolesMiddleware(),
  demoteOrPromoteOrganizationMemberController
);

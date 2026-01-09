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

// Schemas
import {
  acceptOrDeclineUsersRequestToJoinOrganizationSchema,
  demoteOrPromoteOrganizationMemberSchema,
  retirveAllRequestsToJoinOrganizationSchema,
  retrieveAllMembersInOrganizationSchema,
  retrieveOrganizationMemberSchema,
} from "@repo/schemas/organization-managment";
// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles-middleware";
import { validate } from "@/middleware/validate.middleware";

export const organizationManagmentRoutes = Router();

organizationManagmentRoutes.use(express.json());

organizationManagmentRoutes.get(
  "/requests/:organizationId",
  validate({
    schema: retirveAllRequestsToJoinOrganizationSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveAllRequestsToJoinOrganizationController
);

organizationManagmentRoutes.get(
  "/users/:organizationId",
  validate({
    schema: retrieveAllMembersInOrganizationSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveAllUsersInOrganizationController
);
organizationManagmentRoutes.get(
  "/member/:organizationId",
  validate({
    schema: retrieveOrganizationMemberSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveOrganizationMemberController
);

organizationManagmentRoutes.post(
  "/accept-decline-request",
  validate({
    schema: acceptOrDeclineUsersRequestToJoinOrganizationSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({}),
  acceptOrDeclineUsersRequestToJoinOrganizationController
);

organizationManagmentRoutes.post(
  "/demote-promote-member",
  validate({
    schema: demoteOrPromoteOrganizationMemberSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({}),
  demoteOrPromoteOrganizationMemberController
);

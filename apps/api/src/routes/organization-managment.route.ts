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
  leaveOrganizationController,
  retrieveDataAboutOrganizationController,
  deleteOrganizationController,
} from "@/controllers/organization-managment.controller";

// Schemas
import {
  acceptOrDeclineUsersRequestToJoinOrganizationSchema,
  deleteOrganizationSchema,
  demoteOrPromoteOrganizationMemberSchema,
  retirveAllRequestsToJoinOrganizationSchema,
  retrieveAllMembersInOrganizationSchema,
  retrieveOrganizationMemberSchema,
  leaveOrganizationSchema,
  retrieveDataAboutOrganizationSchema,
} from "@repo/schemas/organization-managment";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";
import { proPlanUserMiddleware } from "@/middleware/payment.middleware";

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
  retrieveAllRequestsToJoinOrganizationController,
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
  retrieveAllUsersInOrganizationController,
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
  retrieveOrganizationMemberController,
);

// Admin
organizationManagmentRoutes.get(
  "/data/:organizationId",
  validate({
    schema: retrieveDataAboutOrganizationSchema,
    type: "params",
    responseOutput: "server",
  }),
  proPlanUserMiddleware,
  organizationRolesMiddleware({
    type: "params",
  }),
  retrieveDataAboutOrganizationController,
);

organizationManagmentRoutes.post(
  "/accept-decline-request",
  validate({
    schema: acceptOrDeclineUsersRequestToJoinOrganizationSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({}),
  acceptOrDeclineUsersRequestToJoinOrganizationController,
);

organizationManagmentRoutes.post(
  "/demote-promote-member",
  validate({
    schema: demoteOrPromoteOrganizationMemberSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({}),
  demoteOrPromoteOrganizationMemberController,
);

organizationManagmentRoutes.delete(
  "/leave/:organizationId",
  validate({
    schema: leaveOrganizationSchema,
    type: "params",
    responseOutput: "form",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
    ownerHasAllAccess: false,
  }),
  leaveOrganizationController,
);

// Owner only
organizationManagmentRoutes.delete(
  "/delete/:organizationId",
  validate({
    schema: deleteOrganizationSchema,
    type: "params",
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    type: "params",
  }),
  deleteOrganizationController,
);

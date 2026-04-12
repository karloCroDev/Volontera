// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  retrieveAllRequestsToJoinOrganizationController,
  retrieveAllUsersInOrganizationController,
  retrieveOrganizationMemberController,
  retrieveAllOrganizationLeaveFeedbacksController,
  acceptOrDeclineUsersRequestToJoinOrganizationController,
  demoteOrPromoteOrganizationMemberController,
  removeOrganizationMemberController,
  leaveOrganizationController,
  retrieveDataAboutOrganizationController,
  deleteOrganizationController,
  updateOrganizationController,
} from "@/controllers/organization-managment.controller";

// Schemas
import {
  acceptOrDeclineUsersRequestToJoinOrganizationSchema,
  deleteOrganizationSchema,
  demoteOrPromoteOrganizationMemberSchema,
  retirveAllRequestsToJoinOrganizationSchema,
  removeOrganizationMemberSchema,
  retrieveAllMembersInOrganizationSchema,
  retrieveAllOrganizationLeaveFeedbacksSchema,
  retrieveOrganizationMemberSchema,
  leaveOrganizationSchema,
  leaveOrganizationReasonSchema,
  retrieveDataAboutOrganizationSchema,
  updateOrganizationSchema,
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
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
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
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
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
  retrieveOrganizationMemberController,
);

organizationManagmentRoutes.delete(
  "/leave/:organizationId",
  validate({
    schema: leaveOrganizationSchema,
    type: "params",
    responseOutput: "form",
  }),
  validate({
    schema: leaveOrganizationReasonSchema,
    type: "body",
    responseOutput: "form",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  leaveOrganizationController,
);

organizationManagmentRoutes.get(
  "/leave-feedbacks/:organizationId",
  validate({
    schema: retrieveAllOrganizationLeaveFeedbacksSchema,
    type: "params",
    responseOutput: "server",
  }),
  proPlanUserMiddleware,
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["OWNER"],
  }),
  retrieveAllOrganizationLeaveFeedbacksController,
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
    aquiredRoles: ["OWNER"],
  }),
  retrieveDataAboutOrganizationController,
);

organizationManagmentRoutes.post(
  "/accept-decline-request",
  validate({
    schema: acceptOrDeclineUsersRequestToJoinOrganizationSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["OWNER"] }),
  acceptOrDeclineUsersRequestToJoinOrganizationController,
);

organizationManagmentRoutes.post(
  "/demote-promote-member",
  validate({
    schema: demoteOrPromoteOrganizationMemberSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["OWNER"] }),
  demoteOrPromoteOrganizationMemberController,
);

organizationManagmentRoutes.post(
  "/remove-member",
  validate({
    schema: removeOrganizationMemberSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["OWNER"] }),
  removeOrganizationMemberController,
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
    aquiredRoles: ["OWNER"],
  }),
  deleteOrganizationController,
);

organizationManagmentRoutes.patch(
  "/update-organization",
  validate({
    schema: updateOrganizationSchema,
    responseOutput: "form",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["OWNER"] }),
  updateOrganizationController,
);

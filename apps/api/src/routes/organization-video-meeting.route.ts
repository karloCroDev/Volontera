// External packages
import express, { Router } from "express";

// Controllers
import {
  endOrganizationVideoMeetingController,
  getOrganizationVideoMeetingStateController,
  joinOrganizationVideoMeetingController,
  leaveOrganizationVideoMeetingController,
  startOrganizationVideoMeetingController,
} from "@/controllers/organization-video-meeting.controller";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

// Schemas
import { allOrganizationVideoMeetingSchema } from "@repo/schemas/organization-video-meeting";

export const organizationVideoMeetingRoutes = Router();

organizationVideoMeetingRoutes.use(express.json());

organizationVideoMeetingRoutes.get(
  "/state/:organizationId",
  validate({
    schema: allOrganizationVideoMeetingSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  getOrganizationVideoMeetingStateController,
);

organizationVideoMeetingRoutes.post(
  "/start/:organizationId",
  validate({
    schema: allOrganizationVideoMeetingSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["ADMIN", "OWNER"],
  }),
  startOrganizationVideoMeetingController,
);

organizationVideoMeetingRoutes.post(
  "/join/:organizationId",
  validate({
    schema: allOrganizationVideoMeetingSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  joinOrganizationVideoMeetingController,
);

organizationVideoMeetingRoutes.post(
  "/leave/:organizationId",
  validate({
    schema: allOrganizationVideoMeetingSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  leaveOrganizationVideoMeetingController,
);

organizationVideoMeetingRoutes.post(
  "/end/:organizationId",
  validate({
    schema: allOrganizationVideoMeetingSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["ADMIN", "OWNER"],
  }),
  endOrganizationVideoMeetingController,
);

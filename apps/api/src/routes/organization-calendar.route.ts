// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationEventController,
  deleteOrganizationEventController,
  retrieveOrganizationCalendarController,
  updateOrganizationEventController,
} from "@/controllers/organization-calendar.controller";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  createOrganizationEventSchema,
  deleteOrganizationEventSchema,
  retrieveOrganizationCalendarSchema,
  updateOrganizationEventSchema,
} from "@repo/schemas/organization-calendar";

export const organizationCalendarRoutes = Router();

organizationCalendarRoutes.use(express.json());

organizationCalendarRoutes.get(
  "/:organizationId",
  validate({
    schema: retrieveOrganizationCalendarSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  retrieveOrganizationCalendarController,
);

organizationCalendarRoutes
  .route("/events")
  .post(
    validate({
      schema: createOrganizationEventSchema,
      responseOutput: "toast",
      type: "body",
    }),
    organizationRolesMiddleware({
      aquiredRoles: ["ADMIN"],
    }),
    createOrganizationEventController,
  )
  .patch(
    validate({
      schema: updateOrganizationEventSchema,
      responseOutput: "toast",
      type: "body",
    }),
    organizationRolesMiddleware({
      aquiredRoles: ["ADMIN"],
    }),
    updateOrganizationEventController,
  );

organizationCalendarRoutes.delete(
  "/events/:eventId",
  validate({
    schema: deleteOrganizationEventSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
    type: "params",
  }),
  deleteOrganizationEventController,
);

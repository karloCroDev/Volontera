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
  retrieveOrganizationCalendarQuerySchema,
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
  validate({
    schema: retrieveOrganizationCalendarQuerySchema,
    responseOutput: "server",
    type: "query",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
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
      aquiredRoles: ["ADMIN", "OWNER"],
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
      aquiredRoles: ["ADMIN", "OWNER"],
    }),
    updateOrganizationEventController,
  );

organizationCalendarRoutes.delete(
  "/events/:organizationId/:eventId",
  validate({
    schema: deleteOrganizationEventSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "OWNER"],
    type: "params",
  }),
  deleteOrganizationEventController,
);

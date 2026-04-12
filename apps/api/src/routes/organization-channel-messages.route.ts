// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationChannelMessageController,
  deleteOrganizationChannelMessageController,
  retrieveOrganizationChannelMessagesController,
} from "@/controllers/organization-channel-messages.controller";

// Schemas
import {
  createOrganizationChannelMessageSchema,
  deleteOrganizationChannelMessageSchema,
  retrieveAllOrganizationChannelMessagesSchema,
} from "@repo/schemas/organization-channel-messages";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

export const organizationChannelMessagesRoute = Router();

organizationChannelMessagesRoute.use(express.json());

organizationChannelMessagesRoute.get(
  "/:organizationId/:groupChatId",
  validate({
    schema: retrieveAllOrganizationChannelMessagesSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  retrieveOrganizationChannelMessagesController,
);

organizationChannelMessagesRoute.post(
  "/",
  validate({
    schema: createOrganizationChannelMessageSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER", "OWNER"],
  }),
  createOrganizationChannelMessageController,
);

organizationChannelMessagesRoute.delete(
  "/:organizationId/:messageId",
  validate({
    schema: deleteOrganizationChannelMessageSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER", "OWNER"],
    type: "params",
  }),
  deleteOrganizationChannelMessageController,
);

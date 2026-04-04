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
  createOrganizationGroupChatMessageSchema,
  deleteOrganizationGroupChatMessageSchema,
  retrieveAllOrganizationGroupChatMessagesSchema,
} from "@repo/schemas/organization-channel-messages";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

export const organizationChannelMessagesRoute = Router();

organizationChannelMessagesRoute.use(express.json());

organizationChannelMessagesRoute.get(
  "/:organizationId",
  validate({
    schema: retrieveAllOrganizationGroupChatMessagesSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveOrganizationChannelMessagesController,
);

organizationChannelMessagesRoute.post(
  "/",
  validate({
    schema: createOrganizationGroupChatMessageSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER"],
  }),
  createOrganizationChannelMessageController,
);

organizationChannelMessagesRoute.delete(
  "/:organizationId/:messageId",
  validate({
    schema: deleteOrganizationGroupChatMessageSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER"],
    type: "params",
  }),
  deleteOrganizationChannelMessageController,
);

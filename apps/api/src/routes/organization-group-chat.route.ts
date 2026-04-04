// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationGroupChatChannelController,
  retrieveAllOrganizationGroupChatMessagesController,
  retrieveOrganizationGroupChatChannelsController,
  updateOrganizationGroupChatChannelController,
  deleteOrganizationGroupChatChannelController,
  createOrganizationGroupChatMessageController,
  deleteOrganizationGroupChatMessageController,
} from "@/controllers/organization-group-chat.controller";

// Schemas
import {
  createOrganizationGroupChatChannelSchema,
  createOrganizationGroupChatMessageSchema,
  deleteOrganizationGroupChatChannelSchema,
  deleteOrganizationGroupChatMessageSchema,
  retrieveOrganizationGroupChatChannelsSchema,
  retrieveAllOrganizationGroupChatMessagesSchema,
  updateOrganizationGroupChatChannelSchema,
} from "@repo/schemas/organization-group-chat";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

export const organizationGroupChatRoute = Router();

organizationGroupChatRoute.use(express.json());

organizationGroupChatRoute.get(
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
  retrieveAllOrganizationGroupChatMessagesController,
);

organizationGroupChatRoute.get(
  "/:organizationId/channels",
  validate({
    schema: retrieveOrganizationGroupChatChannelsSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveOrganizationGroupChatChannelsController,
);

organizationGroupChatRoute.post(
  "/channels",
  validate({
    schema: createOrganizationGroupChatChannelSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
  }),
  createOrganizationGroupChatChannelController,
);

organizationGroupChatRoute.patch(
  "/channels/:channelId",
  validate({
    schema: updateOrganizationGroupChatChannelSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
    type: "params",
  }),
  updateOrganizationGroupChatChannelController,
);

organizationGroupChatRoute.delete(
  "/channels/:organizationId/:channelId",
  validate({
    schema: deleteOrganizationGroupChatChannelSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
    type: "params",
  }),
  deleteOrganizationGroupChatChannelController,
);

organizationGroupChatRoute.post(
  "/create-message",
  validate({
    schema: createOrganizationGroupChatMessageSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER"],
  }),
  createOrganizationGroupChatMessageController,
);

organizationGroupChatRoute.delete(
  "/delete-message/:organizationId/:messageId",
  validate({
    schema: deleteOrganizationGroupChatMessageSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER"],
    type: "params",
  }),
  deleteOrganizationGroupChatMessageController,
);

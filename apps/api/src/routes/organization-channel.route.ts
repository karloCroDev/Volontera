// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createOrganizationChannelController,
  deleteOrganizationChannelController,
  retrieveOrganizationChannelsController,
  updateOrganizationChannelController,
} from "@/controllers/organization-channel.controller";

// Schemas
import {
  createOrganizationGroupChatChannelSchema,
  deleteOrganizationGroupChatChannelSchema,
  retrieveOrganizationGroupChatChannelsSchema,
  updateOrganizationGroupChatChannelSchema,
} from "@repo/schemas/organization-channel";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

export const organizationChannelRoute = Router();

organizationChannelRoute.use(express.json());

organizationChannelRoute.get(
  "/:organizationId",
  validate({
    schema: retrieveOrganizationGroupChatChannelsSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveOrganizationChannelsController,
);

organizationChannelRoute.post(
  "/",
  validate({
    schema: createOrganizationGroupChatChannelSchema,
    responseOutput: "toast",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
  }),
  createOrganizationChannelController,
);

organizationChannelRoute.patch(
  "/:organizationId/:channelId",
  validate({
    schema: updateOrganizationGroupChatChannelSchema.pick({
      organizationId: true,
      channelId: true,
    }),
    responseOutput: "toast",
    type: "params",
  }),
  validate({
    schema: updateOrganizationGroupChatChannelSchema.pick({
      channelName: true,
      description: true,
    }),
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
    type: "params",
  }),
  updateOrganizationChannelController,
);

organizationChannelRoute.delete(
  "/:organizationId/:channelId",
  validate({
    schema: deleteOrganizationGroupChatChannelSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN"],
    type: "params",
  }),
  deleteOrganizationChannelController,
);

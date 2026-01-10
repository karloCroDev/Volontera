// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  retrieveAllOrganizationGroupChatMessagesController,
  createOrganizationGroupChatMessageController,
} from "@/controllers/organization-group-chat.controller";

// Schemas
import {
  createOrganizationGroupChatMessageSchema,
  retrieveAllOrganizationGroupChatMessagesSchema,
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
  retrieveAllOrganizationGroupChatMessagesController
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
  createOrganizationGroupChatMessageController
);

organizationGroupChatRoute.delete(
  "/delete-message/:messageId",
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "MEMBER"],
    type: "params",
  })
);

// External packages
import { z } from "zod";

// Schemas
import { organizationIdSchema } from "./organization";

export const retrieveOrganizationChannelsSchema = organizationIdSchema;
export type RetrieveOrganizationChannelsArgs = z.infer<
  typeof retrieveOrganizationChannelsSchema
>;

export const createOrganizationChannelSchema = z
  .object({
    channelName: z.string().min(1).max(100),
    description: z.string().max(200).optional(),
  })
  .extend(organizationIdSchema.shape);
export type CreateOrganizationChannelArgs = z.infer<
  typeof createOrganizationChannelSchema
>;

export const updateOrganizationChannelSchema = z
  .object({
    channelId: z.cuid(),
    channelName: z.string().min(1).max(100).optional(),
    description: z.string().max(200).optional(),
  })
  .extend(organizationIdSchema.shape);
export type UpdateOrganizationChannelArgs = z.infer<
  typeof updateOrganizationChannelSchema
>;

export const deleteOrganizationChannelSchema = z
  .object({
    channelId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationChannelArgs = z.infer<
  typeof deleteOrganizationChannelSchema
>;

// Backward-compatible aliases
export const retrieveOrganizationGroupChatChannelsSchema =
  retrieveOrganizationChannelsSchema;
export type RetrieveOrganizationGroupChatChannelsArgs =
  RetrieveOrganizationChannelsArgs;

export const createOrganizationGroupChatChannelSchema =
  createOrganizationChannelSchema;
export type CreateOrganizationGroupChatChannelArgs =
  CreateOrganizationChannelArgs;

export const updateOrganizationGroupChatChannelSchema =
  updateOrganizationChannelSchema;
export type UpdateOrganizationGroupChatChannelArgs =
  UpdateOrganizationChannelArgs;

export const deleteOrganizationGroupChatChannelSchema =
  deleteOrganizationChannelSchema;
export type DeleteOrganizationGroupChatChannelArgs =
  DeleteOrganizationChannelArgs;

// External packages
import { z } from "zod";

// Schemas
import { organizationIdSchema } from "./organization";

export const retrieveOrganizationChannelsSchema = organizationIdSchema;
export type RetrieveOrganizationChannelsArgs = z.infer<
  typeof retrieveOrganizationChannelsSchema
>;

export const createOrganizationChannelSchema = z.object({
  organizationId: z.cuid(),
  channelName: z.string().min(1).max(100),
  description: z.string().max(200).optional(),
});
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

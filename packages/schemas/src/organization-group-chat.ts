// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";
import { organizationIdSchema } from "./organization";

export const retrieveAllOrganizationGroupChatMessagesSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveAllOrganizationGroupChatMessagesArgs = z.infer<
  typeof retrieveAllOrganizationGroupChatMessagesSchema
>;

export const retrieveOrganizationGroupChatChannelsSchema = organizationIdSchema;
export type RetrieveOrganizationGroupChatChannelsArgs = z.infer<
  typeof retrieveOrganizationGroupChatChannelsSchema
>;

export const organizationGroupChatMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    parentMessageId: z.cuid().optional(),
    images: uploadImageSchema.shape.image.array().optional(),
  })
  .extend(organizationIdSchema.shape);
export type OrganizationGroupChatMessageArgs = z.infer<
  typeof organizationGroupChatMessageSchema
>;

export const createOrganizationGroupChatMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    parentMessageId: z.cuid().optional(),
    imageKeys: z.array(z.string()).optional(),
  })
  .extend(organizationIdSchema.shape);
export type CreateOrganizationGroupChatMessageArgs = z.infer<
  typeof createOrganizationGroupChatMessageSchema
>;

export const createOrganizationGroupChatChannelSchema = z
  .object({
    channelName: z.string().min(1).max(100),
    description: z.string().max(200).optional(),
  })
  .extend(organizationIdSchema.shape);
export type CreateOrganizationGroupChatChannelArgs = z.infer<
  typeof createOrganizationGroupChatChannelSchema
>;

export const updateOrganizationGroupChatChannelSchema = z
  .object({
    channelId: z.cuid(),
    channelName: z.string().min(1).max(100).optional(),
    description: z.string().max(200).optional(),
  })
  .extend(organizationIdSchema.shape);
export type UpdateOrganizationGroupChatChannelArgs = z.infer<
  typeof updateOrganizationGroupChatChannelSchema
>;

export const deleteOrganizationGroupChatChannelSchema = z
  .object({
    channelId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationGroupChatChannelArgs = z.infer<
  typeof deleteOrganizationGroupChatChannelSchema
>;

export const deleteOrganizationGroupChatMessageSchema = z
  .object({
    messageId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationGroupChatMessageArgs = z.infer<
  typeof deleteOrganizationGroupChatMessageSchema
>;

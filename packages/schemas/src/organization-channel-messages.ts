// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";
import { organizationIdSchema } from "./organization";

export const retrieveAllOrganizationChannelMessagesSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveAllOrganizationChannelMessagesArgs = z.infer<
  typeof retrieveAllOrganizationChannelMessagesSchema
>;

export const organizationChannelMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    parentMessageId: z.cuid().optional(),
    images: uploadImageSchema.shape.image.array().optional(),
  })
  .extend(organizationIdSchema.shape);
export type OrganizationChannelMessageArgs = z.infer<
  typeof organizationChannelMessageSchema
>;

export const createOrganizationChannelMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    parentMessageId: z.cuid().optional(),
    imageKeys: z.array(z.string()).optional(),
  })
  .extend(organizationIdSchema.shape);
export type CreateOrganizationChannelMessageArgs = z.infer<
  typeof createOrganizationChannelMessageSchema
>;

export const deleteOrganizationChannelMessageSchema = z
  .object({
    messageId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationChannelMessageArgs = z.infer<
  typeof deleteOrganizationChannelMessageSchema
>;

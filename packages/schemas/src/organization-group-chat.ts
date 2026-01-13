// External packages
import { z } from "zod";
import { uploadImageSchema } from "./image";
import { organizationIdSchema } from "./organization";

export const retrieveAllOrganizationGroupChatMessagesSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveAllOrganizationGroupChatMessagesArgs = z.infer<
  typeof retrieveAllOrganizationGroupChatMessagesSchema
>;

export const organizationGroupChatMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    images: uploadImageSchema.shape.image.array().optional(),
  })
  .extend(organizationIdSchema);
export type OrganizationGroupChatMessageArgs = z.infer<
  typeof organizationGroupChatMessageSchema
>;

export const createOrganizationGroupChatMessageSchema = z
  .object({
    content: z.string().min(1).max(200),
    groupChatId: z.cuid(),
    imageKeys: z.array(z.string()).optional(),
  })
  .extend(organizationIdSchema);
export type CreateOrganizationGroupChatMessageArgs = z.infer<
  typeof createOrganizationGroupChatMessageSchema
>;

export const deleteOrganizationGroupChatMessageSchema = z
  .object({
    messageId: z.cuid(),
  })
  .extend(organizationIdSchema);
export type DeleteOrganizationGroupChatMessageArgs = z.infer<
  typeof deleteOrganizationGroupChatMessageSchema
>;

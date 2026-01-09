// External packages
import { z } from "zod";

export const retrieveAllOrganizationGroupChatMessagesSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveAllOrganizationGroupChatMessagesArgs = z.infer<
  typeof retrieveAllOrganizationGroupChatMessagesSchema
>;

export const createOrganizationGroupChatMessageSchema = z.object({
  content: z.string().min(1).max(200),
  senderId: z.cuid(),
  groupChatId: z.cuid(),
  imageKeys: z.array(z.string()).optional(),
});
export type CreateOrganizationGroupChatMessageArgs = z.infer<
  typeof createOrganizationGroupChatMessageSchema
>;

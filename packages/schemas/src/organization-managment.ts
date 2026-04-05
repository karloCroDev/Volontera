// External packages
import { z } from "zod";
import { organizationIdSchema } from "./organization";
import { uploadImageSchema } from "./image";

// TODO: If there are no more agruments (100% then just use organizationIdSchema directly)
export const retirveAllRequestsToJoinOrganizationSchema = organizationIdSchema;
export type RetirveAllRequestsToJoinOrganizationArgs = z.infer<
  typeof retirveAllRequestsToJoinOrganizationSchema
>;

export const retrieveAllMembersInOrganizationSchema = organizationIdSchema;
export type RetrieveAllMembersInOrganizationArgs = z.infer<
  typeof retrieveAllMembersInOrganizationSchema
>;

export const retrieveOrganizationMemberSchema = organizationIdSchema;
export type RetrieveOrganizationMemberArgs = z.infer<
  typeof retrieveOrganizationMemberSchema
>;

export const leaveOrganizationSchema = z
  .object({
    reason: z.string().min(1).or(z.literal("")).optional(),
  })
  .extend(organizationIdSchema.shape);
export type LeaveOrganizationArgs = z.infer<typeof leaveOrganizationSchema>;

export const leaveOrganizationReasonSchema = z.object({
  reason: z.string().min(1).or(z.literal("")).optional(),
});
export type LeaveOrganizationReasonArgs = z.infer<
  typeof leaveOrganizationReasonSchema
>;

export const demoteOrPromoteOrganizationMemberSchema = z.object({
  organizationId: z.cuid(),
  userId: z.cuid(),
  role: z.enum(["ADMIN", "MEMBER", "BANNED"]),
});
export type DemoteOrPromoteOrganizationMemberArgs = z.infer<
  typeof demoteOrPromoteOrganizationMemberSchema
>;

export const removeOrganizationMemberSchema = z.object({
  organizationId: z.cuid(),
  userId: z.cuid(),
});
export type RemoveOrganizationMemberArgs = z.infer<
  typeof removeOrganizationMemberSchema
>;

export const acceptOrDeclineUsersRequestToJoinOrganizationSchema = z.object({
  requesterIds: z.array(z.cuid()),
  organizationId: z.cuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export type AcceptOrDeclineUsersRequestToJoinOrganizationArgs = z.infer<
  typeof acceptOrDeclineUsersRequestToJoinOrganizationSchema
>;

export const retrieveDataAboutOrganizationSchema = organizationIdSchema;
export type RetrieveDataAboutOrganizationArgs = z.infer<
  typeof retrieveDataAboutOrganizationSchema
>;

export const retrieveAllOrganizationLeaveFeedbacksSchema = organizationIdSchema;
export type RetrieveAllOrganizationLeaveFeedbacksArgs = z.infer<
  typeof retrieveAllOrganizationLeaveFeedbacksSchema
>;

export const updateOrganizationSchema = organizationIdSchema.extend({
  organization_avatar_image: uploadImageSchema.shape.image.optional(),
  organization_cover_image: uploadImageSchema.shape.image.optional(),
  organization_name: z.string().min(1).max(100),
  organization_bio: z.string().min(10),
  organization_type: z.string(),
  organization_location: z.string().optional(),
  external_form_link: z.url().or(z.literal("")).optional(),
  additional_links: z
    .array(
      z
        .object({
          label: z.string(),
          url: z.string(),
        })
        .superRefine((link) => {
          const label = link.label.trim();
          const url = link.url.trim();

          const hasLabel = label.length > 0;
          const hasUrl = url.length > 0;

          if (!hasLabel && !hasUrl) return;
        }),
    )
    .transform((links) =>
      links
        .map((link) => ({
          label: link.label.trim(),
          url: link.url.trim(),
        }))
        .filter((link) => link.label !== "" && link.url !== ""),
    )
    .optional(),
});
export type UpdateOrganizationArgs = z.infer<typeof updateOrganizationSchema>;

export const deleteOrganizationSchema = organizationIdSchema;
export type DeleteOrganizationArgs = z.infer<typeof deleteOrganizationSchema>;

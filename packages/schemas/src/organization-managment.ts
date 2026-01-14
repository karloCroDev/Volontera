// External packages
import { z } from "zod";
import { organizationIdSchema } from "./organization";

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
    reason: z.string().min(1).optional(),
  })
  .extend(organizationIdSchema.shape);
export type LeaveOrganizationArgs = z.infer<typeof leaveOrganizationSchema>;

export const demoteOrPromoteOrganizationMemberSchema = z.object({
  organizationId: z.cuid(),
  userId: z.cuid(),
  role: z.enum(["ADMIN", "MEMBER"]),
});
export type DemoteOrPromoteOrganizationMemberArgs = z.infer<
  typeof demoteOrPromoteOrganizationMemberSchema
>;

export const acceptOrDeclineUsersRequestToJoinOrganizationSchema = z.object({
  requesterIds: z.array(z.cuid()),
  organizationId: z.cuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export type AcceptOrDeclineUsersRequestToJoinOrganizationArgs = z.infer<
  typeof acceptOrDeclineUsersRequestToJoinOrganizationSchema
>;

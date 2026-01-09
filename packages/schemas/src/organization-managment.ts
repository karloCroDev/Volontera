// External packages
import { z } from "zod";

export const retirveAllRequestsToJoinOrganizationSchema = z.object({
  organizationId: z.cuid(),
});
export type RetirveAllRequestsToJoinOrganizationArgs = z.infer<
  typeof retirveAllRequestsToJoinOrganizationSchema
>;

export const retrieveAllMembersInOrganizationSchema = z.object({
  organizationId: z.cuid(),
});

export type RetrieveAllMembersInOrganizationArgs = z.infer<
  typeof retrieveAllMembersInOrganizationSchema
>;

export const retrieveOrganizationMemberSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveOrganizationMemberArgs = z.infer<
  typeof retrieveOrganizationMemberSchema
>;

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

// External packages
import { z } from "zod";

export const retirveAllRequestsToJoinOrganizationSchema = z.object({
  organizationId: z.cuid(),
});
export type RetirveAllRequestsToJoinOrganizationArgs = z.infer<
  typeof retirveAllRequestsToJoinOrganizationSchema
>;

export const retrieveAllUsersInOrganizationSchema = z.object({
  organizationId: z.cuid(),
});

export type RetrieveAllUsersInOrganizationArgs = z.infer<
  typeof retrieveAllUsersInOrganizationSchema
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
  organizationId: z.cuid(),
  requesterId: z.cuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});
export type AcceptOrDeclineUsersRequestToJoinOrganizationArgs = z.infer<
  typeof acceptOrDeclineUsersRequestToJoinOrganizationSchema
>;

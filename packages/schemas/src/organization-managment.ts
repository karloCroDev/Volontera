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

// External packages
import { z } from "zod";

export const allOrganizationVideoMeetingSchema = z.object({
  organizationId: z.cuid(),
});

export type AllOrganizationVideoMeetingArgs = z.infer<
  typeof allOrganizationVideoMeetingSchema
>;

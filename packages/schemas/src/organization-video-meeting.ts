// External packages
import { z } from "zod";

// TODO: Msm da uvijek id userId i organizationId na svim requestovima, ako bude potrebna iznimka onda handleaj na svim slučajevima
export const allOrganizationVideoMeetingSchema = z.object({
  organizationId: z.cuid(),
});

export type AllOrganizationVideoMeetingArgs = z.infer<
  typeof allOrganizationVideoMeetingSchema
>;

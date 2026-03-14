import { z } from "zod";

export const dashboardKPIMetricsQuerySchema = z.object({
  durationDays: z.enum(["30", "60", "90"]).optional(),
});

export type DashboardKPIMetricsQuery = z.infer<
  typeof dashboardKPIMetricsQuerySchema
>;

// External packages
import { z } from "zod";
import { paginationSchema } from "./pagination";

export const dashboardKPIMetricsQuerySchema = z.object({
  durationDays: z.enum(["30", "60", "90"]).optional(),
});

export const dashboardUsersPaginationQuerySchema = z
  .object({
    filter: z.enum(["USER", "ORGANIZATION"]).optional(),
  })
  .extend(paginationSchema.shape);

export type DashboardKPIMetricsQuery = z.infer<
  typeof dashboardKPIMetricsQuerySchema
>;
export type DashboardUsersPaginationQuery = z.infer<
  typeof dashboardUsersPaginationQuerySchema
>;

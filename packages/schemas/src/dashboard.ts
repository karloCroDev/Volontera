// External packages
import { z } from "zod";
import { paginationSchema } from "./pagination";

const coerceFirstQueryValue = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (Array.isArray(value)) return value[0];
    return value;
  }, schema);

export const dashboardKPIMetricsQuerySchema = z.object({
  durationDays: coerceFirstQueryValue(z.coerce.number().int().positive())
    .optional(),
});

export const dashboardUsersPaginationQuerySchema = z
  .object({
    filter: z.enum(["USER", "ORGANIZATION"]).optional(),
    search: coerceFirstQueryValue(
      z.preprocess((value) => {
        if (typeof value !== "string") return undefined;
        const trimmedValue = value.trim();
        return trimmedValue.length > 0 ? trimmedValue : undefined;
      }, z.string().max(100).optional()),
    ),
  })
  .extend(paginationSchema.shape);

export const dashboardBanOrUnbanUserSchema = z.object({
  userId: z.cuid(),
});

export type DashboardKPIMetricsQuery = z.infer<
  typeof dashboardKPIMetricsQuerySchema
>;
export type DashboardUsersPaginationQuery = z.infer<
  typeof dashboardUsersPaginationQuerySchema
>;
export type DashboardBanOrUnbanUserArgs = z.infer<
  typeof dashboardBanOrUnbanUserSchema
>;

// Schemas
import { DashboardKPIMetricsQuery } from "@repo/schemas/dashboard";

export function parseDurationDays(
  value: DashboardKPIMetricsQuery["durationDays"],
) {
  if (value === "60") return 60 as const;
  if (value === "90") return 90 as const;
  return 30 as const;
}

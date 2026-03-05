// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Schemas
import { DashboardKPIMetricsQuery } from "@repo/schemas/dashboard";

// Models
import { retrieveKPIMetrics } from "@/models/dashboard.model";

// Lib
import { parseDurationDays } from "@/lib/utils/dates";

export async function retrieveKPIMetricsService({
  data,
}: {
  data: DashboardKPIMetricsQuery;
}) {
  const durationDays = parseDurationDays(data.durationDays);
  const metrics = await retrieveKPIMetrics({ durationDays });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Successfully retrieved KPI metrics",
    data: metrics,
  });
}

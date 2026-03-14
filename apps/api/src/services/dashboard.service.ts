// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Schemas
import { DashboardKPIMetricsQuery } from "@repo/schemas/dashboard";

// Models
import { retrieveKPIMetrics } from "@/models/dashboard.model";

// Lib
import { parseDurationDays } from "@/lib/utils/dates";
import { buildWeeklyKPISeries } from "../lib/utils/dashboard-kpi";

export async function retrieveKPIMetricsService({
  data,
}: {
  data: DashboardKPIMetricsQuery;
}) {
  const durationDays = parseDurationDays(data.durationDays);
  const rawMetrics = await retrieveKPIMetrics({ durationDays });

  const { kpiRows, ...metrics } = rawMetrics;

  const kpiSeries = buildWeeklyKPISeries({
    since: metrics.since,
    kpiRows,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Successfully retrieved KPI metrics",
    data: {
      ...metrics,
      kpiSeries,
    },
  });
}

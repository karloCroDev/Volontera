// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Schemas
import {
  DashboardKPIMetricsQuery,
  DashboardUsersPaginationQuery,
} from "@repo/schemas/dashboard";

// Models
import {
  retrieveKPIMetrics,
  retrievePaginatedUsers,
} from "@/models/dashboard.model";

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

export async function retrievePaginatedUsersService({
  data,
  userId,
}: {
  data: DashboardUsersPaginationQuery;
  userId: string;
}) {
  const { users, total } = await retrievePaginatedUsers({
    ...data,
    userId,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Successfully retrieved users",
    data: {
      users,
      pagination: {
        total,
        offset: data.offset,
        limit: data.limit,
        hasMore: data.offset + users.length < total,
      },
    },
  });
}

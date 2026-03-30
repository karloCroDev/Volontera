// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Schemas
import {
  DashboardKPIMetricsQuery,
  DashboardUsersPaginationQuery,
} from "@repo/schemas/dashboard";

// Models
import {
  banUser,
  retrieveKPIMetrics,
  retrievePaginatedUsers,
  unbanUser,
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

export async function banUserService({
  userId,
  adminUserId,
}: {
  userId: string;
  adminUserId: string;
}) {
  const bannedUser = await banUser(userId);

  return toastResponseOutput({
    status: 200,
    title: `User ${bannedUser.firstName} ${bannedUser.lastName} banned`,
    message: `The user ${bannedUser.firstName} ${bannedUser.lastName} has been banned successfully`,
  });
}

export async function unbanUserService({
  userId,
  adminUserId,
}: {
  userId: string;
  adminUserId: string;
}) {
  if (userId === adminUserId) {
    return toastResponseOutput({
      status: 400,
      title: "Invalid action",
      message: "You cannot unban your own account",
    });
  }

  const unbannedUser = await unbanUser(userId);

  if (!unbannedUser) {
    return toastResponseOutput({
      status: 404,
      title: "User not found",
      message: "Could not find a user to unban",
    });
  }

  return toastResponseOutput({
    status: 200,
    title: `User ${unbannedUser.firstName} ${unbannedUser.lastName} unbanned`,
    message: `The user ${unbannedUser.firstName} ${unbannedUser.lastName} has been unbanned successfully`,
  });
}

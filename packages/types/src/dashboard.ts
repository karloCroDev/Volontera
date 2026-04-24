// Database
import { User as PrismaUser } from "@repo/database";

import { ServerHandleResponse } from "./general";

export type DashboardDurationDays = number;

export type DashboardKPIMetricsResponse = ServerHandleResponse<true> & {
  durationDays: DashboardDurationDays;
  since: string;
  kpiSeries: {
    week: string;
    totalVolunteers: number;
    totalOrganizations: number;
    totalOrganizators: number;
  }[];
  totalVolunteers: number;
  totalOrganizators: number;
  totalOrganizations: number;
  totalUnpaidUsers: number;
  totalPaidUsers: number;
  usersWithPaidPlan: number;
  organizatorsWithPaidPlan: number;
  organizatorsWithYearlyPaidPlan: number;
  userWithYearlyPaidPlan: number;
};

export type DashboardPaginatedUsersResponse = ServerHandleResponse<true> & {
  users: Omit<PrismaUser, "password">[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};

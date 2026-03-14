import type { ServerHandleResponse } from "./general";

export type DashboardDurationDays = 30 | 60 | 90;

export type DashboardKPIIntervalPoint = {
  week: string;
  totalVolunteers: number;
  totalOrganizations: number;
  totalOrganizators: number;
};

export type DashboardKPIMetricsResponse = ServerHandleResponse<true> & {
  durationDays: DashboardDurationDays;
  since: string;
  kpiSeries: DashboardKPIIntervalPoint[];
  totalVolunteers: number;
  totalOrganizators: number;
  totalOrganizations: number;
  totalUnpaidUsers: number;
  totalPaidUsers: number;
  usersWithPaidPlan: number;
  organizationsWithPaidPlan: number;
  organizationWithYearlyPaidPlan: number;
  userWithYearlyPaidPlan: number;
};

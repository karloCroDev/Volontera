import { ServerHandleResponse } from "./general";
import { User as PrismaUser } from "@repo/database";

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
  organizatorsWithPaidPlan: number;
  organizatorsWithYearlyPaidPlan: number;
  userWithYearlyPaidPlan: number;
};

export type DashboardPaginatedUser = Pick<
  PrismaUser,
  | "id"
  | "firstName"
  | "lastName"
  | "email"
  | "image"
  | "role"
  | "subscriptionTier"
  | "subscriptionType"
  | "isBanned"
  | "onboardingFinished"
  | "createdAt"
>;

export type DashboardUsersPaginationMeta = {
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};

export type DashboardPaginatedUsersResponse = ServerHandleResponse<true> & {
  users: DashboardPaginatedUser[];
  pagination: DashboardUsersPaginationMeta;
};

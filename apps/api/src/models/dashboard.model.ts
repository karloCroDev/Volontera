// Database
import { prisma } from "@repo/database";
import { Prisma, UserRole } from "@repo/database";

// Lib
import { getSinceDate } from "@/lib/utils/dashboard-kpi";

export type DashboardDurationDays = 30 | 60 | 90;

export async function retrieveKPIMetrics({
  durationDays = 30,
}: {
  durationDays?: DashboardDurationDays;
} = {}) {
  const since = getSinceDate(durationDays);

  const [
    totalVolunteers,
    totalOrganizators,
    totalOrganizations,
    totalUnpaidUsers,
    totalPaidUsers,
    usersWithPaidPlan,
    organizatorsWithPaidPlan,
    organizatorsWithYearlyPaidPlan,
    userWithYearlyPaidPlan,
    volunteerRows,
    organizatorRows,
    organizationRows,
  ] = await prisma.$transaction([
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: since },
      },
    }),
    prisma.user.count({
      where: {
        role: "ORGANIZATION",
        createdAt: { gte: since },
      },
    }),
    prisma.organization.count({
      where: {
        createdAt: { gte: since },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: since },
        subscriptionTier: { not: "PRO" },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: since },
        subscriptionTier: "PRO",
      },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: since },
        subscriptionTier: "PRO",
      },
    }),
    prisma.user.count({
      where: {
        role: "ORGANIZATION",
        createdAt: { gte: since },
        subscriptionTier: "PRO",
      },
    }),
    prisma.user.count({
      where: {
        role: "ORGANIZATION",
        createdAt: { gte: since },
        subscriptionTier: "PRO",
        subscriptionType: "YEARLY",
      },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: since },
        subscriptionTier: "PRO",
        subscriptionType: "YEARLY",
      },
    }),

    // Rowovi za KPI seriju
    prisma.user.findMany({
      where: {
        role: "USER",
        createdAt: { gte: since },
      },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: {
        role: "ORGANIZATION",
        createdAt: { gte: since },
      },
      select: { createdAt: true },
    }),
    prisma.organization.findMany({
      where: {
        createdAt: { gte: since },
      },
      select: { createdAt: true },
    }),
  ]);

  return {
    durationDays,
    since,
    totalVolunteers,
    totalOrganizators,
    totalOrganizations,
    totalUnpaidUsers,
    totalPaidUsers,
    usersWithPaidPlan,
    organizatorsWithPaidPlan,
    organizatorsWithYearlyPaidPlan,
    userWithYearlyPaidPlan,
    kpiRows: {
      volunteerRows,
      organizatorRows,
      organizationRows,
    },
  };
}

export async function retrievePaginatedUsers({
  offset = 0,
  limit = 10,
  filter,
  search,
  userId,
}: {
  userId: string;
  offset?: number;
  limit?: number;
  filter?: UserRole;
  search?: string;
}) {
  const roles: UserRole[] = filter ? [filter] : ["USER", "ORGANIZATION"];

  const searchConditions: Prisma.UserWhereInput[] | undefined = search
    ? [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    : undefined;

  const whereClause: Prisma.UserWhereInput = {
    role: {
      in: roles,
    },
    NOT: { id: userId },

    ...(searchConditions ? { OR: searchConditions } : {}),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,

      omit: { password: true },
      orderBy: {
        createdAt: "desc",
      },
      skip: +offset,
      take: +limit,
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  return { users, total };
}

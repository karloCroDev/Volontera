// Database
import { prisma } from "@repo/database";

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

import { prisma } from "@repo/database";

export type DashboardDurationDays = 30 | 60 | 90;

function getSinceDate(durationDays: DashboardDurationDays) {
  const since = new Date();
  since.setDate(since.getDate() - durationDays);
  return since;
}

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
    organizationsWithPaidPlan,
    organizationWithYearlyPaidPlan,
    userWithYearlyPaidPlan,
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
    organizationsWithPaidPlan,
    organizationWithYearlyPaidPlan,
    userWithYearlyPaidPlan,
  };
}

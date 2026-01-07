// Database
import { Organization, prisma } from "@repo/database";

export async function retirveAllRequestsToJoinOrganization(
  organizationId: Organization["id"]
) {
  return prisma.organizationJoinRequest.findMany({
    where: {
      organizationId,
      status: "PENDING",
    },
    include: {
      requester: true,
    },
  });
}

export async function retrieveAllUsersInOrganization(
  organizationId: Organization["id"]
) {
  return prisma.organizationMember.findMany({
    where: {
      organizationId,
    },
    include: {
      user: true,
    },
  });
}

// TODO: Cache this because I am going to use it a lot inside the organization
export async function retrieveOrganizationMember({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: string;
}) {
  return prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

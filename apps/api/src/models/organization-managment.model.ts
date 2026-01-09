// Database
import {
  Organization,
  OrganizationJoinRequest,
  OrganizationMember,
  prisma,
} from "@repo/database";

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

export async function retrieveAllMembersInOrganization({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: string;
}) {
  return prisma.organizationMember.findMany({
    where: {
      organizationId,
      // NOT: {
      //   userId,
      // },
    },
    include: {
      user: true,
    },
  });
}

export async function acceptOrDeclineUsersRequestToJoinOrganization({
  organizationId,
  requesterId,
  status,
}: {
  organizationId: Organization["id"];
  requesterId: string;
  status: OrganizationJoinRequest["status"];
}) {
  return prisma.organizationJoinRequest.updateMany({
    where: {
      organizationId,
      requesterId,
      status: "PENDING",
    },
    data: {
      status,
    },
  });
}

export async function demoteOrPromoteOrganizationMember({
  organizationId,
  userId,
  role,
}: {
  organizationId: Organization["id"];
  userId: string;
  role: OrganizationMember["role"];
}) {
  return prisma.organizationMember.updateMany({
    where: {
      organizationId,
      userId,
    },
    data: {
      role,
    },
  });
}

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

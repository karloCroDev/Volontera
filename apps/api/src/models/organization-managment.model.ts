// Database
import {
  Organization,
  OrganizationJoinRequest,
  OrganizationMember,
  prisma,
  User,
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
      NOT: {
        userId,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function acceptOrDeclineUsersRequestToJoinOrganization({
  organizationId,
  requesterIds,
  status,
}: {
  requesterIds: OrganizationJoinRequest["requesterId"][];
  organizationId: Organization["id"];
  status: OrganizationJoinRequest["status"];
}) {
  return prisma.$transaction(async (tx) => {
    await tx.organizationJoinRequest.updateMany({
      where: {
        organizationId,
        status: "PENDING",
        requesterId: {
          in: requesterIds,
        },
      },
      data: {
        status,
      },
    });

    await tx.organizationMember.createMany({
      data: requesterIds.map((requesterId) => ({
        organizationId,
        userId: requesterId,
      })),
    });
  });
}

export async function demoteOrPromoteOrganizationMember({
  organizationId,
  userId,
  role,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
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
  userId: User["id"];
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

export async function leaveOrganization({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return prisma.organizationMember.delete({
    where: {
      // Owner je automatski vlasnik, pa mu onemogućavamo da ode iz organizacije (jedino je može izbrisati)
      role: {
        not: "OWNER",
      },
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });
}

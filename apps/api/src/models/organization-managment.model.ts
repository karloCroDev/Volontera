// Database
import {
  Organization,
  OrganizationJoinRequest,
  OrganizationMember,
  prisma,
  User,
} from "@repo/database";

export async function deleteOrganizationAsOwner({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return prisma.organization.delete({
    where: { id: organizationId },
  });
}

export async function retirveAllRequestsToJoinOrganization(
  organizationId: Organization["id"],
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
    const pendingRequests = await tx.organizationJoinRequest.findMany({
      where: {
        organizationId,
        status: "PENDING",
        requesterId: {
          in: requesterIds,
        },
      },
      select: {
        requesterId: true,
      },
    });

    const pendingRequesterIds = pendingRequests.map((r) => r.requesterId);

    await tx.organizationJoinRequest.updateMany({
      where: {
        organizationId,
        status: "PENDING",
        requesterId: {
          in: pendingRequesterIds,
        },
      },
      data: {
        status,
      },
    });

    if (status === "APPROVED" && pendingRequesterIds.length > 0) {
      await tx.organizationMember.createMany({
        data: pendingRequesterIds.map((requesterId) => ({
          organizationId,
          userId: requesterId,
        })),
        skipDuplicates: true,
      });
    }

    return pendingRequesterIds;
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
  return prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
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
    include: {
      user: true,
    },
  });
}

export async function leaveOrganization({
  organizationId,
  userId,
  reason,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
  reason?: string;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.organizationJoinRequest.deleteMany({
      where: {
        organizationId,
        requesterId: userId,
      },
    });
    await tx.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (reason) {
      await tx.organizationLeaveFeedback.create({
        data: {
          organizationId,
          reason,
          authorId: userId,
        },
      });
    }
  });
}

export async function retrieveDataAboutOrganization(
  organizationId: Organization["id"],
) {
  return prisma.$transaction(async (tx) => {
    const highPriority = await tx.organizationTask.count({
      where: {
        organizationId,
        status: "HIGH_PRIORITY",
      },
    });
    const mediumPriority = await tx.organizationTask.count({
      where: {
        organizationId,
        status: "MEDIUM_PRIORITY",
      },
    });
    const lowPriority = await tx.organizationTask.count({
      where: {
        organizationId,
        status: "LOW_PRIORITY",
      },
    });

    const adminUserCount = await tx.organizationMember.count({
      where: {
        organizationId,
        role: "ADMIN",
      },
    });
    const memberUserCount = await tx.organizationMember.count({
      where: {
        organizationId,
        role: "MEMBER",
      },
    });

    const totalUserCount = adminUserCount + memberUserCount + 1;

    return {
      highPriority,
      mediumPriority,
      lowPriority,
      adminUserCount,
      memberUserCount,
      totalUserCount,
    };
  });
}

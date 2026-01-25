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
        // Owner je automatski vlasnik, pa mu onemogućavamo da ode iz organizacije
        role: {
          not: "OWNER",
        },
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

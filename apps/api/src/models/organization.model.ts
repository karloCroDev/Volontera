// Database
import { Organization, prisma, User } from "@repo/database";

// Types
import {
  CreateOrganizationArgs,
  SendRequestToJoinOrganizationArgs,
} from "@repo/schemas/organization";

// Owners only
export async function listOrganizationsOrganizator(userId: User["id"]) {
  return prisma.organization.findMany({
    where: {
      OR: [
        // Organization owner
        { ownerId: userId },
        // Following organization
        {
          organizationFollowers: {
            some: {
              followerUserId: userId,
            },
          },
        },

        // Attending organization
        {
          organizationMembers: {
            some: {
              userId,
            },
          },
        },
      ],
    },
  });
}

export async function listOrganizationsOrganizatorGrouped(userId: User["id"]) {
  const [ownedOrganizations, followingOrganizations, attendingOrganizations] =
    await prisma.$transaction([
      prisma.organization.findMany({
        where: {
          ownerId: userId,
        },
      }),
      prisma.organization.findMany({
        where: {
          organizationFollowers: {
            some: {
              followerUserId: userId,
            },
          },
        },
      }),
      prisma.organization.findMany({
        where: {
          AND: [
            { ownerId: { not: userId } },
            {
              organizationMembers: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      }),
    ]);

  return {
    ownedOrganizations,
    followingOrganizations,
    attendingOrganizations,
  };
}

export async function createOrganization({
  data,
  userId,
  imageKeys,
}: {
  data: CreateOrganizationArgs;
  userId: User["id"];
  imageKeys: {
    avatarImageKey: string;
    coverImageKey: string;
  };
}) {
  return await prisma.organization.create({
    data: {
      name: data.organization_name,
      bio: data.organization_bio,
      ownerId: userId,
      avatarImage: imageKeys.avatarImageKey,
      organizationInfo: {
        create: {
          bio: data.organization_bio,
          coverImage: imageKeys?.coverImageKey,
          type: data.organization_type,
          location: data.organization_location,
          externalFormLink: data.external_form_link,
          additionalLinks: data.additional_links
            ? {
                createMany: {
                  data: [...(data.additional_links ?? [])].map((link) => ({
                    url: link.url,
                    name: link.label,
                  })),
                },
              }
            : undefined,
        },
      },
      organizationMembers: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });
}

// User only
export async function listOrganizationsUser(userId: User["id"]) {
  const [followingOrganizations, attendingOrganizations] =
    await prisma.$transaction([
      prisma.organization.findMany({
        where: {
          organizationFollowers: {
            some: {
              followerUserId: userId,
            },
          },
        },
      }),
      prisma.organization.findMany({
        where: {
          organizationMembers: {
            some: {
              userId,
            },
          },
        },
      }),
    ]);

  return {
    followingOrganizations,
    attendingOrganizations,
  };
}

export async function sendRequestToJoinOrganization({
  data,
  userId,
}: {
  data: SendRequestToJoinOrganizationArgs;
  userId: User["id"];
}) {
  return prisma.organizationJoinRequest.create({
    data: {
      ...data,
      requesterId: userId,
      status: "PENDING",
    },
  });
}

// All
// TODO: Handle this with redis or something simmilar and make alogirthm for that
export async function searchOrganizationsByName(query: string) {
  return prisma.organization.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}

export async function getOrganizationDetailsById({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: User["id"];
}) {
  const [organization, isFollowing, adminMembers, otherMembers] =
    await prisma.$transaction([
      // Organizacijski detalji  + vlasnikovi podaci
      prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
        include: {
          owner: {
            omit: {
              password: true,
            },
          },

          _count: {
            select: {
              organizationFollowers: true,
              organizationMembers: true,
            },
          },

          organizationInfo: {
            include: {
              additionalLinks: true,
            },
          },
        },
      }),
      // Je li trenutni korisnik prati organizaciju
      prisma.organizationFollowers.findUnique({
        where: {
          organizationId_followerUserId: {
            followerUserId: userId,
            organizationId,
          },
        },
      }),
      // Admini organizacije
      prisma.organizationMember.findMany({
        where: {
          organizationId,
          role: "ADMIN",
        },
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // Obični članovi
      prisma.organizationMember.findMany({
        where: {
          organizationId,
          role: "MEMBER",
        },
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
        take: 5,
      }),
    ]);

  if (!organization) return null;

  return {
    organization,
    isFollowing,
    membersHierarchy: {
      admins: adminMembers,
      members: otherMembers,
    },
  };
}

export async function followOrganization({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return prisma.organizationFollowers.create({
    data: {
      followerUserId: userId,
      organizationId: organizationId,
    },
  });
}

export async function unfollowOrganization({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return prisma.organizationFollowers.delete({
    where: {
      organizationId_followerUserId: {
        organizationId,
        followerUserId: userId,
      },
    },
  });
}

export async function checkIfUserFollowsOrganization({
  organizationId,
  userId,
}: {
  organizationId: Organization["id"];
  userId: User["id"];
}) {
  return prisma.organizationFollowers.findUnique({
    where: {
      organizationId_followerUserId: {
        organizationId,
        followerUserId: userId,
      },
    },
  });
}

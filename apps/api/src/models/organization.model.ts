// Database
import { prisma, User } from "@repo/database";

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

export async function getOrganizationDetailsById(organizationId: string) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      organizationMembers: true,
      organizationFollowers: true,
      organizationInfo: {
        include: {
          additionalLinks: true,
        },
      },

      // Vrati po hijewrarhiji korisnike i onda displayamo na frontendu (admini organizacije, vlasnik i neke korisnike)
      // owner: true,
    },
  });
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

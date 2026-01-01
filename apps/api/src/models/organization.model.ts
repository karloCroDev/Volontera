// Database
import { prisma, User } from "@repo/database";

// Types
import { CreateOrganizationArgs } from "@repo/schemas/create-organization";

// Owners only
export async function listAllOrganizationsOwner(userId: User["id"]) {
  return prisma.organization.findMany({
    where: {
      ownerId: userId,
    },
  });
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
    },
  });
}

// User only
export async function listAllOrganizationsUser(userId: User["id"]) {
  return prisma.organization.findMany({
    where: {
      // Following organization
      OR: [
        {
          organizationFollowers: {
            some: {
              followerUserId: userId,
            },
          },
        },

        // Attending organization
        {
          organizationAttendees: {
            some: {
              attendeeUserId: userId,
            },
          },
        },
      ],
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

export async function getOrganizationDetailsById(organizationId: string) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      organizationAttendees: true,
      organizationFollowers: true,
      organizationInfo: {
        include: {
          additionalLinks: true,
        },
      },

      owner: true,
    },
  });
}

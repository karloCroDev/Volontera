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
}: {
  data: CreateOrganizationArgs;
  userId: User["id"];
}) {
  return await prisma.organization.create({
    data: {
      name: data.organization_name,
      bio: data.organization_bio,
      ownerId: userId,
      organizationInfo: {
        create: {
          bio: data.organization_bio,
          type: data.organization_type,
          externalFormLink: data.external_form_link,
          additionalLinks: data.additional_links
            ? {
                createMany: {
                  data: [...(data.additional_links ?? [])].map((link) => ({
                    link,
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

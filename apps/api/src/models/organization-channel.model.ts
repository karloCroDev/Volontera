// Database
import { Organization, OrganizationChannels, prisma } from "@repo/database";

export async function retrieveOrganizationGroupChatChannels(
  organizationId: Organization["id"],
) {
  return prisma.organizationChannels.findMany({
    where: {
      organizationId,
    },
  });
}

export async function createOrganizationChannelChat({
  organizationId,
  name,
  description,
}: {
  organizationId: Organization["id"];
  name: OrganizationChannels["name"];
  description: OrganizationChannels["description"];
}) {
  return prisma.organizationChannels.create({
    data: {
      name,
      description,
      organizationId,
    },
  });
}

export async function deleteOrganizationChannelChat({
  channelId,
  organizationId,
}: {
  channelId: OrganizationChannels["id"];
  organizationId: Organization["id"];
}) {
  return prisma.organizationChannels.delete({
    where: {
      id: channelId,
      organizationId,
    },
  });
}

export async function updateOrganizationChannelChat({
  channelId,
  organizationId,
  name,
  description,
}: {
  channelId: OrganizationChannels["id"];
  organizationId: Organization["id"];
  name: OrganizationChannels["name"];
  description: OrganizationChannels["description"];
}) {
  // TODO: Indexiraj ovo pod hitno!!!
  return prisma.organizationChannels.update({
    where: {
      id: channelId,
      organizationId,
    },
    data: {
      name,
      description,
    },
  });
}

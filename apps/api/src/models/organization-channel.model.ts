// Database
import { Organization, OrganizationChannelChat, prisma } from "@repo/database";

export async function retrieveOrganizationGroupChatChannels(
  organizationId: Organization["id"],
) {
  return prisma.organizationGroupChat.findUnique({
    where: {
      organizationId,
    },
    include: {
      channelChat: true,
    },
  });
}

export async function createOrganizationChannelChat({
  organizationId,
  channelName,
  description,
}: {
  organizationId: Organization["id"];
  channelName: OrganizationChannelChat["name"];
  description?: OrganizationChannelChat["description"];
}) {
  return prisma.organizationChannelChat.create({
    data: {
      name: channelName,
      description,
      organizationId,
    },
  });
}

export async function deleteOrganizationChannelChat({
  channelId,
  organizationId,
}: {
  channelId: OrganizationChannelChat["id"];
  organizationId: Organization["id"];
}) {
  return prisma.organizationChannelChat.delete({
    where: {
      id: channelId,
      organizationId,
    },
  });
}

export async function updateOrganizationChannelChat({
  channelId,
  organizationId,
  channelName,
  description,
}: {
  channelId: OrganizationChannelChat["id"];
  organizationId: Organization["id"];
  channelName?: OrganizationChannelChat["name"];
  description?: OrganizationChannelChat["description"];
}) {
  // TODO: Indexiraj ovo pod hitno!!!
  return prisma.organizationChannelChat.update({
    where: {
      id: channelId,
      organizationId,
    },
    data: {
      ...(channelName ? { name: channelName } : {}),
      ...(description ? { description } : {}),
    },
  });
}

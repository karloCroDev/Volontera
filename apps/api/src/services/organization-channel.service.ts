// Models
import {
  createOrganizationChannelChat,
  deleteOrganizationChannelChat,
  retrieveOrganizationGroupChatChannels,
  updateOrganizationChannelChat,
} from "@/models/organization-channel.model";

// Schemas
import {
  CreateOrganizationChannelArgs,
  DeleteOrganizationChannelArgs,
  RetrieveOrganizationChannelsArgs,
  UpdateOrganizationChannelArgs,
} from "@repo/schemas/organization-channel";

// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Channels
export async function retrieveOrganizationGroupChatChannelsService({
  organizationId,
}: RetrieveOrganizationChannelsArgs) {
  const organizationChannels =
    await retrieveOrganizationGroupChatChannels(organizationId);

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved organization group chat channels",
    data: { organizationChannels },
    success: true,
  });
}

export async function createOrganizationGroupChatChannelService({
  data,
}: {
  data: CreateOrganizationChannelArgs;
}) {
  const createdChannel = await createOrganizationChannelChat({
    organizationId: data.organizationId,
    name: data.channelName,
    ...(data.description ? { description: data.description } : {}),
  });

  return toastResponseOutput({
    title: `Successful created ${createdChannel.name} channel`,
    message: `Successfully created ${createdChannel.name} channel`,
    status: 200,
  });
}

export async function updateOrganizationGroupChatChannelService({
  data,
}: {
  data: UpdateOrganizationChannelArgs;
}) {
  await updateOrganizationChannelChat({
    channelId: data.channelId,
    organizationId: data.organizationId,
    ...(data.channelName ? { name: data.channelName } : {}),
    ...(data.description ? { description: data.description } : {}),
  });

  return toastResponseOutput({
    title: `Successfuly updated ${data.channelName} channel`,
    message: `Successfully updated ${data.channelName} channel`,
    status: 200,
  });
}

export async function deleteOrganizationGroupChatChannelService({
  data,
}: {
  data: DeleteOrganizationChannelArgs;
}) {
  const deletedChannel = await deleteOrganizationChannelChat({
    channelId: data.channelId,
    organizationId: data.organizationId,
  });

  return toastResponseOutput({
    title: `Successfuly deleted ${deletedChannel.name} channel`,
    message: `Successfully deleted ${deletedChannel.name} channel`,
    status: 200,
  });
}

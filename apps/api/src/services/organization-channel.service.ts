// Models
import {
  createOrganizationChannelChat,
  deleteOrganizationChannelChat,
  retrieveOrganizationGroupChatChannels,
  updateOrganizationChannelChat,
} from "@/models/organization-channel.model";

// Schemas
import {
  CreateOrganizationGroupChatChannelArgs,
  DeleteOrganizationGroupChatChannelArgs,
  RetrieveOrganizationGroupChatChannelsArgs,
  UpdateOrganizationGroupChatChannelArgs,
} from "@repo/schemas/organization-channel";

// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Channels
export async function retrieveOrganizationGroupChatChannelsService({
  organizationId,
}: RetrieveOrganizationGroupChatChannelsArgs) {
  const organizationGroupChat =
    await retrieveOrganizationGroupChatChannels(organizationId);

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved organization group chat channels",
    data: { organizationGroupChat },
    success: true,
  });
}

export async function createOrganizationGroupChatChannelService({
  data,
}: {
  data: CreateOrganizationGroupChatChannelArgs;
}) {
  const createdChannel = await createOrganizationChannelChat({
    organizationId: data.organizationId,
    channelName: data.channelName,
    description: data.description,
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
  data: UpdateOrganizationGroupChatChannelArgs;
}) {
  await updateOrganizationChannelChat({
    channelId: data.channelId,
    organizationId: data.organizationId,
    channelName: data.channelName,
    description: data.description,
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
  data: DeleteOrganizationGroupChatChannelArgs;
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

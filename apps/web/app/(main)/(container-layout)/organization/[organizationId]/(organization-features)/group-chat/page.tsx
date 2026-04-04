// External packages
import { notFound } from 'next/navigation';

// Lib
import { retrieveOrganizationChannelsServer } from '@/lib/server/organization-channel';

// Modules
import { CreateChannelDialog } from '@/modules/main/organization/channels/add-channel-dialog';
import { ChannelsMapping } from '@/modules/main/organization/channels/channels-mapping';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export default async function GroupChatChannelPage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;
	const channels = await retrieveOrganizationChannelsServer(organizationId);

	if (!channels.success) notFound();

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['organization-channels', organizationId],
		queryFn: async () => channels,
	});
	const dehydratedState = dehydrate(queryClient);
	return (
		<>
			<div className="mb-6 flex flex-col justify-between gap-x-8 gap-y-4 overflow-x-scroll lg:flex-row lg:items-center">
				<div>
					<h4 className="text-xl lg:text-2xl">Group chat</h4>
					<p className="text-muted-foreground">
						All group chat channels that are assigned inside this organization
					</p>
				</div>

				<CreateChannelDialog organizationId={organizationId} />
			</div>

			<div className="no-scrollbar border-input-border relative flex min-h-[600px] flex-1 flex-col gap-4 overflow-y-scroll rounded-lg border p-4">
				<ChannelsMapping
					dehydratedState={dehydratedState}
					organizationId={organizationId}
				/>
			</div>
		</>
	);
}

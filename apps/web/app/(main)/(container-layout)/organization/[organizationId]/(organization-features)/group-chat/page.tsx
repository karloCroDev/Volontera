// External packages
import Link from 'next/link';

// Components
import { Container } from '@/components/ui/container';

// Modules
import { CreateChannelDialog } from '@/modules/main/organization/channels/add-channel-dialog';
import { EditChannelDialog } from '@/modules/main/organization/channels/edit-channel-dialog';
import { DeleteChannelDialog } from '@/modules/main/organization/channels/delete-channel-dialog';

export default async function GroupChatChannelPage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;
	console.log(organizationId);
	return (
		<>
			<div className="no-scrollbar flex min-h-[600px] flex-1 flex-col gap-4 overflow-y-scroll">
				{[...Array(10)].map((_, indx) => (
					<Container
						key={indx}
						className="border-accent group/container flex rounded-lg"
					>
						<Link
							className="flex-1 px-4 py-3"
							href={`/organization/${organizationId}/group-chat/${indx}`}
						>
							<div>
								<p className="text-lg font-bold"># General</p>
								<p className="text-muted-foreground text-sm">Description</p>
							</div>
						</Link>

						<div className="flex items-center justify-center gap-6 px-3 opacity-0 transition-opacity group-hover/container:opacity-100">
							<EditChannelDialog />
							<DeleteChannelDialog channelName="yessir" />
						</div>
					</Container>
				))}
			</div>
			<div className="flex items-center justify-end pt-2">
				<CreateChannelDialog />
			</div>
		</>
	);
}

// External packages
import Link from 'next/link';
import { Pen, Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
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
		channelId: string;
	}>;
}) {
	const { organizationId, channelId } = await params;
	console.log(organizationId, channelId);
	return (
		<>
			<div className="no-scrollbar flex min-h-[600px] flex-1 flex-col gap-4 overflow-y-scroll">
				{[...Array(10)].map((_, indx) => (
					<Container key={indx} className="flex rounded-lg">
						<Link
							className="flex-1 px-4 py-3"
							href={`/organization/${organizationId}/group-chat/${indx}`}
						>
							<div>
								<p className="text-lg font-bold"># General</p>
								<p className="text-muted-foreground text-sm">Description</p>
							</div>
						</Link>

						<div className="flex items-center justify-center gap-6 px-3">
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

'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';

// Hooks
import { useRetrieveOrganizationChannels } from '@/hooks/data/organization-channel';
import { useRetrieveOrganizationMember } from '@/hooks/data/organization-managment';

// Components
import { Container } from '@/components/ui/container';

// Modules
import { EditChannelDialog } from '@/modules/main/organization/channels/edit-channel-dialog';
import { DeleteChannelDialog } from '@/modules/main/organization/channels/delete-channel-dialog';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ChannelsMapping = withReactQueryProvider(
	({ organizationId }: { organizationId: string }) => {
		const { data: channels } = useRetrieveOrganizationChannels({
			organizationId,
		});

		const { data: member } = useRetrieveOrganizationMember({
			organizationId,
		});
		// Ovo je suspendirano, ali pošto se koristi i u drugim komponentama koje nisu suspendirane, onda mi je lakše napisati samo useQuery iako znamo da dobijamo 100% tu vrijednost odmah sa servera zato ide
		return channels!.organizationChannels.length > 0 ? (
			channels!.organizationChannels.map((channel) => (
				<Container
					key={channel.id}
					className="hover:border-accent group/container flex rounded-lg transition-[border]"
				>
					<Link
						className="flex-1 px-4 py-3"
						href={`/organization/${organizationId}/group-chat/${channel.id}`}
					>
						<div>
							<p className="text-lg font-bold"># {channel.name}</p>
							{channel.description && (
								<p className="text-muted-foreground text-sm">
									{channel.description}
								</p>
							)}
						</div>
					</Link>

					{(member?.organizationMember.role === 'ADMIN' ||
						member?.organizationMember.role === 'OWNER') && (
						<div className="flex items-center justify-center gap-6 px-3 opacity-0 transition-opacity group-hover/container:opacity-100">
							<EditChannelDialog
								channelId={channel.id}
								channelName={channel.name}
								description={channel.description || ''}
								organizationId={organizationId}
							/>
							<DeleteChannelDialog
								channelId={channel.id}
								channelName={channel.name}
							/>
						</div>
					)}
				</Container>
			))
		) : (
			<p className="text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
				There are currently no channels available.
			</p>
		);
	}
);

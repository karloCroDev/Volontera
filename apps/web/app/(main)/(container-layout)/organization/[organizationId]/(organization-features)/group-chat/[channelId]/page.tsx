// External packages
import { notFound } from 'next/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

// Lib
import { retrieveAllOrganizationChannelMessagesServer } from '@/lib/server/organization-channel-messages';
import { getSession } from '@/lib/server/user';

// Modules
import { SocketRoomContext } from '@/modules/main/organization/group-chat/socker-room-context';
import { GroupChatMapping } from '@/modules/main/organization/group-chat/group-chat-mapping';
import { AddMessageForm } from '@/modules/main/organization/group-chat/add-message-form';

// Components
import { MessagesReplyProvider } from '@/components/ui/message/reply-context';
import { MessageSkeleton } from '@/components/ui/message/message';

export default async function GroupChatPage({
	params,
}: {
	params: Promise<{ organizationId: string; channelId: string }>;
}) {
	const { organizationId, channelId } = await params;

	return (
		<SocketRoomContext>
			<div className="relative min-h-[600px] flex-1 gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<MessagesReplyProvider>
					<Suspense
						fallback={[...Array(5)].map((_, index) => (
							<MessageSkeleton
								key={index}
								variant={index % 2 === 0 ? 'primary' : 'secondary'}
							/>
						))}
					>
						<GroupChatMessages
							organizationId={organizationId}
							channelId={channelId}
						/>
					</Suspense>
					<AddMessageForm groupChatId={channelId} />
				</MessagesReplyProvider>
			</div>
		</SocketRoomContext>
	);
}

async function GroupChatMessages({
	organizationId,
	channelId,
}: {
	organizationId: string;
	channelId: string;
}) {
	const groupChat = await retrieveAllOrganizationChannelMessagesServer(
		organizationId,
		channelId
	);

	if (!groupChat.success) notFound();

	const queryClient = new QueryClient();

	// Ovo preftcham zbog hydration moram preftchati korisnika, nemoj raditi ovo na driugim komponentama da server ne bude spor
	await queryClient.prefetchQuery({
		queryKey: ['session'],
		queryFn: () => getSession(),
	});

	await queryClient.prefetchQuery({
		queryKey: ['organization-channel-messages', organizationId, channelId],
		queryFn: async () => groupChat,
	});

	return <GroupChatMapping dehydratedState={dehydrate(queryClient)} />;
}

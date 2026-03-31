'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { twJoin } from 'tailwind-merge';
import { useQueryClient } from '@tanstack/react-query';

// Modules
import { UsersSearch } from '@/modules/main/direct-messages/users-search';
import { UsersSidebar } from '@/modules/main/direct-messages/users-sidebar';

import { useSocketContext } from '@/modules/main/direct-messages/socket-context';
import { useGetListOfDirectMessages } from '@/hooks/data/direct-messages';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ListUsers = withReactQueryProvider(() => {
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const { data: listOfAllDirectMessages } = useGetListOfDirectMessages();
	const { onlineUsers, socketGlobal } = useSocketContext();

	const isActive = searchParams.get('userId');

	React.useEffect(() => {
		if (!socketGlobal) return;

		const syncSidebar = () => {
			queryClient.invalidateQueries({
				predicate: ({ queryKey }) =>
					typeof queryKey[0] === 'string' &&
					queryKey[0].startsWith('direct-messages'),
			});
		};

		socketGlobal.on('new-chat', syncSidebar);
		socketGlobal.on('direct-messages:message-deleted', syncSidebar);

		return () => {
			socketGlobal.off('new-chat', syncSidebar);
			socketGlobal.off('direct-messages:message-deleted', syncSidebar);
		};
	}, [queryClient, socketGlobal]);

	return (
		<aside
			className={twJoin(
				'border-input-border flex h-full w-full min-w-80 flex-col border-r px-4 py-6 lg:w-1/4 lg:px-6',
				isActive && 'hidden lg:flex'
			)}
		>
			<h4 className="mb-4 text-lg underline underline-offset-4 lg:text-xl">
				Your DM&apos;s
			</h4>
			<UsersSearch />

			<div className="no-scrollbar mt-4 flex-1 overflow-scroll">
				{listOfAllDirectMessages.conversations.length > 0 &&
					listOfAllDirectMessages.conversations.map((conversation) => (
						<UsersSidebar
							imageUrl={
								conversation.participant.image
									? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${conversation.participant.image}`
									: undefined
							}
							isOnline={onlineUsers.includes(conversation.participant.id)}
							username={`${conversation.participant.firstName} ${conversation.participant.lastName}`}
							lastMessage={conversation.lastMessage || undefined}
							isVerified={conversation.participant.subscriptionTier === 'PRO'}
							id={conversation.participant.id}
							key={conversation.participant.id}
						/>
					))}
			</div>
		</aside>
	);
});

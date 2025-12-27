'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { twJoin } from 'tailwind-merge';

// Modules
import { UsersSearch } from '@/modules/main/direct-messages/users-search';
import { UsersSidebar } from '@/modules/main/direct-messages/users-sidebar';

// Types
import { ListConversationsResponse } from '@repo/types/direct-messages';

export const ListUsers: React.FC<{
	listOfAllDirectMessages: ListConversationsResponse;
}> = ({ listOfAllDirectMessages }) => {
	const searchParams = useSearchParams();

	const isActive = searchParams.get('user');

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
							username={`${conversation.participant.firstName} ${conversation.participant.lastName}`}
							lastMessage={conversation.lastMessage || undefined}
							conversationId={conversation.id}
							id={conversation.participant.id}
							key={conversation.participant.id}
						/>
					))}
			</div>
		</aside>
	);
};

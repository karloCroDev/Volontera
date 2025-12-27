'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Markdown from 'react-markdown';

// Components
import { Message, MessageSkeleton } from '@/components/ui/message';
import { Avatar } from '@/components/ui/avatar';

// Hooks
import { useGetDirectMessagesConversationById } from '@/hooks/data/direct-messages';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export const Conversation = withReactQueryProvider(() => {
	const searchParams = useSearchParams();

	const { data: conversation, isLoading } =
		useGetDirectMessagesConversationById(
			{
				conversationId: searchParams.get('conversationId')!,
			},
			{
				enabled: !!searchParams.get('conversationId'),
			}
		);

	return (
		<div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto">
			{isLoading &&
				[...Array(5)].map((_, index) => <MessageSkeleton key={index} />)}

			{conversation?.conversation && conversation.conversation.length > 0 ? (
				conversation.conversation.map((message) => (
					<Message
						key={message.id}
						date={new Date(message.createdAt)}
						avatar={
							<Avatar
								imageProps={{
									src: message.author.image || '',
								}}
							>
								{convertToFullname({
									firstname: message.author.firstName,
									lastname: message.author.lastName,
								})}
							</Avatar>
						}
					>
						<Markdown>{message.content}</Markdown>
					</Message>
				))
			) : (
				<p className="text-muted-foreground text-center">
					No messages found. Start a new conversation
				</p>
			)}
		</div>
	);
});

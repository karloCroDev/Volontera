'use client';

// External packages
import * as React from 'react';
import Markdown from 'react-markdown';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Message, MessageSkeleton } from '@/components/ui/message';

// Hooks
import { useGetHelpConversation } from '@/hooks/data/help';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { HelpConversationSuccess } from '@repo/types/help';
import { HelpMessageForm } from '@/modules/main/help/help-message-form';

export const MessagesMapping: React.FC<{
	initialData: HelpConversationSuccess;
	user: SessionSuccessResponse;
}> = withReactQueryProvider(({ initialData, user }) => {
	const { data: helpConversation } = useGetHelpConversation({
		initialData,
	});

	const [mutating, setMutating] = React.useState(false);

	return (
		<>
			<div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
				{helpConversation.messages.length > 0 ? (
					helpConversation.messages.map((message) => {
						const hours = new Date(message.createdAt)
							.getHours()
							.toString()
							.padStart(2, '0');
						const minutes = new Date(message.createdAt)
							.getMinutes()
							.toString()
							.padStart(2, '0');

						const day = new Date(message.createdAt).getDate();
						const month = new Date(message.createdAt).getMonth() + 1;
						const year = new Date(message.createdAt).getFullYear();

						return (
							<Message
								key={message.id}
								variant={
									message.senderType === 'USER' ? 'primary' : 'secondary'
								}
								date={`${hours}:${minutes} | ${day}.${month}. ${year}`}
								avatar={
									<Avatar
										imageProps={{
											src: message.senderType === 'USER' ? user.image : '',
										}}
									>
										{message.senderType === 'USER' ? user.fullname : 'A I'}
									</Avatar>
								}
							>
								{<Markdown>{message.content}</Markdown>}
							</Message>
						);
					})
				) : (
					<p className="text-muted-foreground mt-10 text-center">
						{initialData.title}
					</p>
				)}
				{mutating && <MessageSkeleton variant="secondary" />}
			</div>
			<HelpMessageForm setMutating={setMutating} />
		</>
	);
});

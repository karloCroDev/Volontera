'use client';

// External packages
import * as React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/components/ui/message';

// Hooks
import { useGetImageFromKeys } from '@/hooks/data/image';
import { useRetrieveAllOrganizationGroupChatMessages } from '@/hooks/data/organization-group-chat';

// Lib
import { convertToFullname } from '@/lib/utils/converter';

// Types
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';
import { useSession } from '@/hooks/data/user';

export const GroupChatMapping: React.FC<{
	groupChat: RetrieveAllOrganizationGroupChatMessagesResponse;
}> = ({ groupChat }) => {
	const params = useParams<{ organizationId: string }>();
	const { data } = useRetrieveAllOrganizationGroupChatMessages(
		{
			organizationId: params.organizationId,
		},
		{
			initialData: groupChat,
		}
	);

	const { data: images } = useGetImageFromKeys({
		imageUrls: data.organizationGroupChat.messages
			.map((message) => message.author.image)
			.filter((url) => url !== null),
	});

	const { socketGlobal } = useSocketContext();

	const [messages, setMessages] = React.useState(
		data.organizationGroupChat.messages
	);

	React.useEffect(() => {
		setMessages(data.organizationGroupChat.messages);
	}, [data]);

	React.useEffect(() => {
		if (!socketGlobal) return;
		socketGlobal.on('organization-group-chat:new-message', (newChat) =>
			setMessages(messages ? [...messages, newChat] : [newChat])
		);

		return () => {
			socketGlobal.off('organization-group-chat:new-message');
		};
	}, [messages, setMessages, socketGlobal]);

	const { data: user } = useSession();
	return messages && messages.length > 0 ? (
		messages.map((message) => (
			<Message
				key={message.id}
				date={new Date(message.createdAt)}
				variant={user?.id === message.author.id ? 'primary' : 'secondary'}
				avatar={
					<Avatar
						imageProps={{
							src: message.author.image
								? images?.urls[message.author.image]
								: undefined,
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
			No messages yet. Be the first to send a message!
		</p>
	);
};

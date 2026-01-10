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

	console.log('DATA MESSAGES:', data);
	return data.organizationGroupChat.messages.map((message) => (
		<>
			<Message
				date={new Date(message.createdAt)}
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
		</>
	));
};

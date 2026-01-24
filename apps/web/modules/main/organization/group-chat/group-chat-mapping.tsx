'use client';

// External packages
import * as React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/components/ui/message/message';

// Hooks
import { useGetImageFromKeys } from '@/hooks/data/image';
import {
	useDeleteOrganizationGroupChatMessage,
	useRetrieveAllOrganizationGroupChatMessages,
} from '@/hooks/data/organization-group-chat';

// Lib
import { convertToFullname } from '@/lib/utils/converter';

// Types
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';
import { useSession } from '@/hooks/data/user';
import { MessageImages } from '@/components/ui/message/message-images';

export const GroupChatMapping: React.FC<{
	groupChat: RetrieveAllOrganizationGroupChatMessagesResponse;
}> = ({ groupChat }) => {
	const params = useParams<{ organizationId: string }>();
	const organizationId = params.organizationId;
	const { data } = useRetrieveAllOrganizationGroupChatMessages(
		{
			organizationId,
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
	React.useEffect(() => {
		if (!socketGlobal) return;

		type OrgChatMessage =
			RetrieveAllOrganizationGroupChatMessagesResponse['organizationGroupChat']['messages'][number];
		const handleNewMessage = (newChat: OrgChatMessage | OrgChatMessage[]) => {
			setMessages((prev) => {
				const prevMessages = prev ?? [];
				return Array.isArray(newChat)
					? [...prevMessages, ...newChat]
					: [...prevMessages, newChat];
			});
		};

		type OrgMessageDeletedPayload = {
			messageId: string;
			organizationId: string;
		};
		const handleMessageDeleted = (payload: OrgMessageDeletedPayload) => {
			if (payload.organizationId !== organizationId) return;
			setMessages((prev) =>
				prev?.filter((msg) => msg.id !== payload.messageId)
			);
		};

		socketGlobal.on('organization-group-chat:new-message', handleNewMessage);
		socketGlobal.on(
			'organization-group-chat:message-deleted',
			handleMessageDeleted
		);

		return () => {
			socketGlobal.off('organization-group-chat:new-message', handleNewMessage);
			socketGlobal.off(
				'organization-group-chat:message-deleted',
				handleMessageDeleted
			);
		};
	}, [organizationId, socketGlobal]);

	const [messages, setMessages] = React.useState(
		data.organizationGroupChat.messages
	);

	// // Stavljalju poruke koje su fetchane iz hooka u state (radi lakšeg upravljanja porukama sa ws)
	// React.useEffect(() => {
	// 	setMessages(data.organizationGroupChat.messages);
	// }, [data]);

	// Scrolla se na dna containera kada se pojavi nova poruka
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	React.useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages]);

	const { data: user } = useSession();

	const { mutate: mutateDeleteMessage } =
		useDeleteOrganizationGroupChatMessage();
	return (
		<div
			className="no-scrollbar pb-50 h-full min-h-0 overflow-y-auto scroll-smooth"
			ref={containerRef}
		>
			{messages && messages.length > 0 ? (
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
						images={
							message.organizationGroupChatMessageImages[0]?.imageUrl && (
								<MessageImages
									imageUrls={message.organizationGroupChatMessageImages.map(
										(img) => img.imageUrl
									)}
								/>
							)
						}
						deleteAction={() =>
							mutateDeleteMessage({
								organizationId,
								messageId: message.id,
							})
						}
					>
						<Markdown>{message.content}</Markdown>
					</Message>
				))
			) : (
				<p className="text-muted-foreground text-center">
					No messages yet. Be the first to send a message!
				</p>
			)}
		</div>
	);
};

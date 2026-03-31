'use client';

// External packages
import * as React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/components/ui/message/message';
import { MessageImages } from '@/components/ui/message/message-images';
import { useMessagesReply } from '@/components/ui/message/reply-context';

// Hooks
import {
	useDeleteOrganizationGroupChatMessage,
	useRetrieveAllOrganizationGroupChatMessages,
} from '@/hooks/data/organization-group-chat';

// Lib
import { convertToFullname } from '@/lib/utils/converter';

// Types
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';

// Hooks
import { useSession } from '@/hooks/data/user';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

type OrgChatMessage =
	RetrieveAllOrganizationGroupChatMessagesResponse['organizationGroupChat']['messages'][number];

export const GroupChatMapping = withReactQueryProvider(() => {
	const params = useParams<{ organizationId: string }>();
	const { replyingTo, setReplyingTo } = useMessagesReply();
	const { data } = useRetrieveAllOrganizationGroupChatMessages({
		organizationId: params.organizationId,
	});

	const { socketGlobal } = useSocketContext();
	React.useEffect(() => {
		if (!socketGlobal) return;

		const handleNewMessage = (newChat: OrgChatMessage | OrgChatMessage[]) => {
			setMessages((prev) => {
				const prevMessages = prev ?? [];
				return Array.isArray(newChat)
					? [...prevMessages, ...newChat]
					: [...prevMessages, newChat];
			});
		};

		const handleMessageDeleted = (payload: {
			messageId: string;
			organizationId: string;
		}) => {
			if (payload.organizationId !== params.organizationId) return;
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
	}, [params.organizationId, socketGlobal]);

	const [messages, setMessages] = React.useState(
		data.organizationGroupChat.messages
	);

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
						isBeingRepliedTo={replyingTo?.id === message.id}
						onReplyClick={() =>
							setReplyingTo({
								id: message.id,
								content: message.content,
							})
						}
						avatar={
							<Avatar
								imageProps={{
									src: message.author.image
										? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${message.author.image}`
										: undefined,
								}}
								isVerified={message.author.subscriptionTier === 'PRO'}
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
									imageUrls={message.organizationGroupChatMessageImages
										.map((img) => img.imageUrl)
										.filter(Boolean)}
								/>
							)
						}
						deleteAction={() =>
							mutateDeleteMessage({
								organizationId: params.organizationId,
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
});

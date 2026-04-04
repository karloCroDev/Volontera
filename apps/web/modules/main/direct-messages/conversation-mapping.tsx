'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';

// Components
import { Message, MessageSkeleton } from '@/components/ui/message/message';
import { Avatar } from '@/components/ui/avatar';
import { MessageImages } from '@/components/ui/message/message-images';
import { useMessagesReply } from '@/components/ui/message/reply-context';
import { MessageIndicator } from '@/components/ui/message/message-indicator';

// Hooks
import {
	useDeleteDirectMessageById,
	useGetDirectMessagesConversationById,
} from '@/hooks/data/direct-messages';
import { useSession } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/converter';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

// Types
import { GetDirectMessagesConversationByIdResponse } from '@repo/types/direct-messages';

// Schemas
import { DeleteDirectMessageArgs } from '@repo/schemas/direct-messages';

export const ConversationMapping = withReactQueryProvider(() => {
	const searchParams = useSearchParams();
	const recieverId = searchParams.get('userId');
	const { replyingTo, setReplyingTo } = useMessagesReply();

	const { data: conversation, isLoading } =
		useGetDirectMessagesConversationById(
			{
				recieverId: recieverId || '',
			},
			{ enabled: !!recieverId }
		);
	const activeConversationId = conversation?.conversationId;

	// Samo stavljam nove poruke kada se razgovor učita
	const [messages, setMessages] = React.useState(conversation?.directMessages);

	// Slušam nove poruke preko socketa
	const { socketGlobal } = useSocketContext();
	React.useEffect(() => {
		if (!socketGlobal) return;

		const handleNewChat = (
			newChat: GetDirectMessagesConversationByIdResponse['directMessages'][0]
		) => {
			setMessages((prev) => (prev ? [...prev, newChat] : [newChat]));
		};

		const handleMessageDeleted = ({
			conversationId: payloadConversationId,
			messageId,
			messageIds,
		}: DeleteDirectMessageArgs & { messageIds?: string[] }) => {
			if (
				activeConversationId &&
				payloadConversationId !== activeConversationId
			)
				return;

			const idsToDelete = new Set(
				messageIds?.length ? messageIds : [messageId]
			);

			if (replyingTo?.id && idsToDelete.has(replyingTo.id)) {
				setReplyingTo(null);
			}

			setMessages((prev) => prev?.filter((msg) => !idsToDelete.has(msg.id)));
		};

		socketGlobal.on('new-chat', handleNewChat);
		socketGlobal.on('direct-messages:message-deleted', handleMessageDeleted);

		return () => {
			socketGlobal.off('new-chat', handleNewChat);
			socketGlobal.off('direct-messages:message-deleted', handleMessageDeleted);
		};
	}, [
		activeConversationId,
		recieverId,
		replyingTo?.id,
		setReplyingTo,
		socketGlobal,
	]);

	// Dobivam trenutno ulogiranog korisnika za prikaz varijanti poruka
	const { data: user } = useSession();

	const containerRef = React.useRef<HTMLDivElement | null>(null);

	// Brisanje poruke
	const { mutate: mutateDeleteMessage } = useDeleteDirectMessageById();

	return (
		<div className="relative h-full min-h-0">
			<div
				className="no-scrollbar pb-50 h-full min-h-0 overflow-y-auto scroll-smooth"
				ref={containerRef}
			>
				{isLoading &&
					[...Array(5)].map((_, indx) => (
						<MessageSkeleton
							key={indx}
							variant={indx % 2 === 0 ? 'primary' : 'secondary'}
						/>
					))}

				{!isLoading &&
					(messages && messages.length > 0 ? (
						messages.map((message) => (
							<Message
								key={message.id}
								variant={
									message.author.id === user?.id ? 'primary' : 'secondary'
								}
								date={new Date(message.createdAt)}
								reply={message.parentMessage?.content || undefined}
								isBeingRepliedTo={replyingTo?.id === message.id}
								onReplyClick={() =>
									setReplyingTo({
										id: message.id,
										conversationId: message.conversationId,
										content: message.content,
									})
								}
								avatar={
									<Link href={`/profile/${message.author.id}`}>
										<Avatar
											imageProps={{
												src: message.author.image
													? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${message.author.image}`
													: '',
											}}
										>
											{convertToFullname({
												firstname: message.author.firstName,
												lastname: message.author.lastName,
											})}
										</Avatar>
									</Link>
								}
								images={
									message.directMessagesImages[0]?.imageUrl && (
										<MessageImages
											imageUrls={message.directMessagesImages
												.map((img) => img.imageUrl)
												.filter(Boolean)}
										/>
									)
								}
								deleteAction={() =>
									mutateDeleteMessage({
										conversationId: message.conversationId,
										messageId: message.id,
									})
								}
							>
								<Markdown>{message.content}</Markdown>
							</Message>
						))
					) : (
						<p className="text-muted-foreground text-center">
							No messages found. Start a new conversation
						</p>
					))}
			</div>

			<MessageIndicator
				containerRef={containerRef}
				lastItemId={messages?.[messages.length - 1]?.id}
				resetKey={recieverId || undefined}
				offset={120}
			/>
		</div>
	);
});

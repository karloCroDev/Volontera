'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Markdown from 'react-markdown';
import Image from 'next/image';

// Components
import { Message, MessageSkeleton } from '@/components/ui/message';
import { Avatar } from '@/components/ui/avatar';

// Hooks
import { useGetDirectMessagesConversationById } from '@/hooks/data/direct-messages';
import { useSession } from '@/hooks/data/user';
import { useGetImageFromKey } from '@/hooks/data/image';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/SocketContext';

// Types
import { EmitNewChat } from '@repo/types/sockets';

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

	const { socketGlobal } = useSocketContext();

	const [messages, setMessages] = React.useState(conversation?.conversation);

	React.useEffect(() => {
		setMessages(conversation?.conversation);
	}, [conversation]);

	React.useEffect(() => {
		if (!socketGlobal) return;
		socketGlobal.on<EmitNewChat>('new-chat', (newChat) =>
			setMessages(messages ? [...messages, newChat] : [newChat])
		);

		return () => {
			socketGlobal.off<EmitNewChat>('new-chat');
		};
	}, [messages, setMessages, socketGlobal]);

	const { data: userImages } = useGetImageFromKey(
		{
			imageUrls:
				messages
					?.map((message) => message.author.image || '')
					.filter(Boolean) || [],
		},
		{
			enabled: messages && !!messages.length,
		}
	);
	const { data: images } = useGetImageFromKey(
		{
			imageUrls:
				messages
					?.map((message) =>
						message.directMessagesImages.map((img) => img.imageUrl)
					)
					.flat() || [],
		},
		{
			enabled: messages && !!messages.length,
		}
	);

	console.log('Cool images', images);
	const { data: user } = useSession();

	console.log('Conversation', conversation);
	console.log(messages?.at(-1)?.content);

	return (
		<div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto">
			{isLoading &&
				[...Array(5)].map((_, indx) => (
					<MessageSkeleton
						key={indx}
						variant={indx % 2 === 0 ? 'primary' : 'secondary'}
					/>
				))}

			{messages && messages.length > 0
				? messages.map((message) => (
						<Message
							key={message.id}
							variant={message.author.id === user?.id ? 'primary' : 'secondary'}
							date={new Date(message.createdAt)}
							avatar={
								<Avatar
									imageProps={{
										src: message.author.image
											? userImages?.urls[message.author.image]
											: '',
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

							{message.directMessagesImages.map(({ imageUrl, id }) => {
								console.log('Image url', images?.urls[imageUrl]);
								return (
									images?.urls[imageUrl] && (
										<div
											key={id}
											className="relative flex h-80 w-80 overflow-hidden rounded-md"
										>
											<Image
												src={images.urls[imageUrl]}
												alt="Message Image"
												fill
												className="object-cover"
											/>
										</div>
									)
								);
							})}
						</Message>
					))
				: !isLoading && (
						<p className="text-muted-foreground text-center">
							No messages found. Start a new conversation
						</p>
					)}
		</div>
	);
});

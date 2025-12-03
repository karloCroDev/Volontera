// Components
import { Avatar } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { Message, MessageSkeleton } from '@/components/ui/message';
import { getHelpConversation } from '@/lib/server/help';

// Lib
import { getSession } from '@/lib/server/auth';

// Modules
import { HelpMessageForm } from '@/modules/main/help/help-message-form';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function HelpPage() {
	// Layout already handles the session so we know that the user is 100% logged in
	const user = (await getSession()) as SessionSuccessResponse;

	const getMessages = await getHelpConversation();

	return (
		<>
			<Heading subtitle="Ask our automated AI assistant to help you navigate our website">
				Help
			</Heading>

			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-4">
					{getMessages.messages.map((message) => {
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
								{message.content}
							</Message>
						);
					})}

					<MessageSkeleton variant="primary" />
				</div>

				<HelpMessageForm />
			</div>
		</>
	);
}

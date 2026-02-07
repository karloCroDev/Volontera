// Modules
import { ListUsers } from '@/modules/main/direct-messages/list-users';
import { MessageForm } from '@/modules/main/direct-messages/message-form';
import { MessageWrapper } from '@/modules/main/direct-messages/message-wrapper';
import { UsersInfoHeader } from '@/modules/main/direct-messages/users-info-header';
import { ConversationMapping } from '@/modules/main/direct-messages/conversation-mapping';

// Lib
import { getListOfAllDirectMessages } from '@/lib/server/direct-messages';

export default async function DirectMessagesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	console.log('Search param server', await searchParams);
	const listOfAllDirectMessages = await getListOfAllDirectMessages();

	return (
		<div className="flex h-full">
			<ListUsers listOfAllDirectMessages={listOfAllDirectMessages} />

			<MessageWrapper>
				<UsersInfoHeader />

				<div className="relative min-h-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<ConversationMapping />
					<MessageForm />
				</div>
			</MessageWrapper>
		</div>
	);
}

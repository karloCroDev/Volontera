// Components
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/components/ui/message';

// Modules
import { ListUsers } from '@/modules/main/direct-messages/list-users';
import { MessageForm } from '@/modules/main/direct-messages/message-form';
import { MessageWrapper } from '@/modules/main/direct-messages/message-wrapper';
import { UsersInfoHeader } from '@/modules/main/direct-messages/users-info-header';

// Lib
import { getListOfAllDirectMessages } from '@/lib/server/direct-messages';
import { Conversation } from '@/modules/main/direct-messages/conversation';

export default async function DirectMessagesPage() {
	const listOfAllDirectMessages = await getListOfAllDirectMessages();

	return (
		<div className="flex h-full">
			<ListUsers listOfAllDirectMessages={listOfAllDirectMessages} />

			<MessageWrapper>
				<UsersInfoHeader />

				<div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<Conversation />

					<MessageForm />
				</div>
			</MessageWrapper>
		</div>
	);
}

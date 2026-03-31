// External packages
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Modules
import { ListUsers } from '@/modules/main/direct-messages/list-users';
import { MessageWrapper } from '@/modules/main/direct-messages/message-wrapper';
import { UsersInfoHeader } from '@/modules/main/direct-messages/users-info-header';
import { ConversationMapping } from '@/modules/main/direct-messages/conversation-mapping';
import { MessageForm } from '@/modules/main/direct-messages/message-form';

// Lib
import { getListOfAllDirectMessages } from '@/lib/server/direct-messages';

// Components
import { MessagesReplyProvider } from '@/components/ui/message/reply-context';

export default async function DirectMessagesPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['direct-messages'],
		queryFn: getListOfAllDirectMessages,
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<div className="flex h-full">
			<ListUsers dehydratedState={dehydratedState} />

			<MessageWrapper>
				<UsersInfoHeader />

				<div className="relative min-h-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<MessagesReplyProvider>
						<ConversationMapping />
						<MessageForm />
					</MessagesReplyProvider>
				</div>
			</MessageWrapper>
		</div>
	);
}

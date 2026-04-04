// External packages
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

// Modules
import { ListUsers } from '@/modules/main/direct-messages/list-users';
import { MessageWrapper } from '@/modules/main/direct-messages/message-wrapper';
import { UsersInfoHeader } from '@/modules/main/direct-messages/users-info-header';
import { ConversationMapping } from '@/modules/main/direct-messages/conversation-mapping';
import { MessageForm } from '@/modules/main/direct-messages/message-form';

// Lib
import {
	getDirectMessagesConversationById,
	getListOfAllDirectMessages,
} from '@/lib/server/direct-messages';
import { getSession } from '@/lib/server/user';

// Components
import { MessagesReplyProvider } from '@/components/ui/message/reply-context';
import { MessageSkeleton } from '@/components/ui/message/message';
import { Skeleton } from '@/components/ui/skeleton';

export default async function DirectMessagesPage({
	searchParams,
}: {
	searchParams: Promise<{ userId?: string }>;
}) {
	const resolvedSearchParams = await searchParams;
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['direct-messages'],
		queryFn: getListOfAllDirectMessages,
	});
	return (
		<div className="flex h-full">
			<ListUsers dehydratedState={dehydrate(queryClient)} />
			<MessageWrapper>
				<Suspense fallback={<DirectMessagesConversationFallback />}>
					<DirectMessagesConversation userId={resolvedSearchParams.userId} />
				</Suspense>
			</MessageWrapper>
		</div>
	);
}

async function DirectMessagesConversation({ userId }: { userId?: string }) {
	const queryClient = new QueryClient();

	if (userId) {
		// Ovo preftcham zbog hydration moram preftchati korisnika, nemoj raditi ovo na driugim komponentama da server ne bude pre spor
		await queryClient.prefetchQuery({
			queryKey: ['session'],
			queryFn: () => getSession(),
		});
		await queryClient.prefetchQuery({
			queryKey: ['direct-messages-conversation', userId],
			queryFn: () =>
				getDirectMessagesConversationById({
					recieverId: userId,
				}),
		});
	}

	const dehydratedState = dehydrate(queryClient);

	return (
		<>
			<UsersInfoHeader />

			<div className="relative min-h-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<MessagesReplyProvider>
					<ConversationMapping
						dehydratedState={dehydratedState}
						recieverId={userId}
					/>
					<MessageForm />
				</MessagesReplyProvider>
			</div>
		</>
	);
}

function DirectMessagesConversationFallback() {
	return (
		<>
			<div className="border-input-border flex h-28 items-center gap-4 border-b px-4 sm:px-6 lg:px-8">
				<div className="block lg:hidden">
					<Skeleton className="h-6 w-6 rounded" />
				</div>
				<Skeleton className="h-16 w-16 rounded-full" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-4 w-44" />
				</div>
				<div className="ml-auto flex items-center gap-2">
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
			<div className="relative min-h-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				{[...Array(5)].map((_, index) => (
					<MessageSkeleton
						key={index}
						variant={index % 2 === 0 ? 'primary' : 'secondary'}
					/>
				))}
			</div>
		</>
	);
}

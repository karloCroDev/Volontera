// External packages
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Components
import { Heading } from '@/components/ui/heading';
import { MessageSkeleton } from '@/components/ui/message/message';

// Lib
import { getHelpConversation } from '@/lib/server/help';
import { getSession } from '@/lib/server/user';

// Types
import { MessagesMapping } from '@/modules/main/help/messages-mapping';

export default async function HelpPage() {
	return (
		<>
			<Heading subtitle="Ask our automated AI assistant to help you navigate our website">
				Help
			</Heading>

			<div className="relative flex min-h-0 flex-1 flex-col">
				<Suspense
					fallback={[...Array(3)].map((_, indx) => (
						<MessageSkeleton
							variant={indx % 2 === 0 ? 'primary' : 'secondary'}
							key={indx}
						/>
					))}
				>
					<MessagesServer />
				</Suspense>
			</div>
		</>
	);
}

async function MessagesServer() {
	const user = await getSession();
	if (!user.success) redirect('/auth/login');

	const helpConversation = await getHelpConversation();

	if (!helpConversation.success)
		return <div>Failed to load help conversation.</div>;

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['help'],
		queryFn: async () => helpConversation,
	});

	const dehydratedState = dehydrate(queryClient);
	return <MessagesMapping user={user} dehydratedState={dehydratedState} />;
}

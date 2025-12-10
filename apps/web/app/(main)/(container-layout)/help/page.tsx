// Components
import { Heading } from '@/components/ui/heading';

// Lib
import { getHelpConversation } from '@/lib/server/help';
import { getSession } from '@/lib/server/auth';

// Types
import { MessagesMapping } from '@/modules/main/help/messages-mapping';
import { redirect } from 'next/navigation';

export default async function HelpPage() {
	// TODO: Look if I need to write once again if I am already running this code in layout or not

	const user = await getSession();
	if (!user.success) redirect('/auth/login');

	const helpConversation = await getHelpConversation();

	return (
		<>
			<Heading subtitle="Ask our automated AI assistant to help you navigate our website">
				Help
			</Heading>

			<div className="flex flex-1 flex-col">
				<MessagesMapping user={user} initialData={helpConversation} />
			</div>
		</>
	);
}

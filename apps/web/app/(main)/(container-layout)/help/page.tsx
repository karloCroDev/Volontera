// Components
import { Heading } from '@/components/ui/heading';

// Lib
import { getHelpConversation } from '@/lib/server/help';
import { getSession } from '@/lib/server/auth';

// Modules
import { HelpMessageForm } from '@/modules/main/help/help-message-form';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { MessagesMapping } from '@/modules/main/help/messages-mapping';

export default async function HelpPage() {
	// Layout already handles the session so we know that the user is 100% logged in
	const user = (await getSession()) as SessionSuccessResponse;

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

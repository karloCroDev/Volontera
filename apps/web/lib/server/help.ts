// Lib
import { serverFetch } from '@/lib/utils/server-fetch';
import { ErrorToastResponse } from '@repo/types/general';

// Types

import { HelpConversationSuccess } from '@repo/types/help';

// Handle types
export async function getHelpConversation(): Promise<HelpConversationSuccess> {
	return await serverFetch({
		url: 'help/help-conversation',
		init: { next: { tags: ['help'] } },
	});
}

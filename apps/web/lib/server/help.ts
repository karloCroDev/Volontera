// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { ServerHandleResponse } from '@repo/types/general';

// Handle types
export async function getHelpConversation(): Promise<
	SessionSuccessResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'help/help-conversation',
		init: { next: { tags: ['help'] } },
	});
}

// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ListConversationsResponse } from '@repo/types/direct-messages';

// Handle types
export async function getListOfAllDirectMessages(): Promise<ListConversationsResponse> {
	return await serverFetch({
		url: 'direct-messages',
		init: { next: { tags: ['direct-messages'] } },
	});
}

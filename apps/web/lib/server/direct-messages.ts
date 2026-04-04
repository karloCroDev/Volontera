// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import {
	GetDirectMessagesConversationByIdResponse,
	ListConversationsResponse,
} from '@repo/types/direct-messages';

// Handle types
export async function getListOfAllDirectMessages(): Promise<ListConversationsResponse> {
	return await serverFetch({
		url: 'direct-messages',
		init: { next: { tags: ['direct-messages'] } },
	});
}

export async function getDirectMessagesConversationById({
	recieverId,
}: {
	recieverId: string;
}): Promise<GetDirectMessagesConversationByIdResponse> {
	return await serverFetch({
		url: `direct-messages/${recieverId}`,
		init: { next: { tags: ['direct-messages-conversation', recieverId] } },
	});
}

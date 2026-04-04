// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveAllOrganizationChannelMessagesResponse } from '@repo/types/organization-channel-messages';

export async function retrieveAllOrganizationChannelMessagesServer(
	organizationId: string,
	groupChatId: string
): Promise<
	RetrieveAllOrganizationChannelMessagesResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `organization-channel-messages/${organizationId}/${groupChatId}`,
		init: {
			next: { tags: ['organization-channel-messages'] },
			cache: 'no-store',
		},
	});
}

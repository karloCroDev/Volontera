// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';

export async function retreiveAllrganizationGroupChatMessages(
	organizationId: string
): Promise<
	RetrieveAllOrganizationGroupChatMessagesResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `organization-group-chat/${organizationId}`,
		init: { next: { tags: ['organization-members'] }, cache: 'no-store' },
	});
}

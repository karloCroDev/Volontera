// Utils
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveOrganizationChannelsResponse } from '@repo/types/organization-channel';

export async function retrieveOrganizationChannelsServer(
	organizationId: string
): Promise<RetrieveOrganizationChannelsResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `organization-channel/${organizationId}`,
		init: { next: { tags: ['organization-channel'] }, cache: 'no-store' },
	});
}

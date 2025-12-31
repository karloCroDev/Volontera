// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { GetOrganizationDetailsByIdResponse } from '@repo/types/organization';

export async function getOrganizationDetailsById(
	organizationId: string
): Promise<GetOrganizationDetailsByIdResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `organization/${organizationId}`,
		init: { next: { tags: ['organization-details'] }, cache: 'no-store' },
	});
}

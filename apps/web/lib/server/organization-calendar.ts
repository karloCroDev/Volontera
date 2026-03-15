// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

export async function retrieveOrganizationCalendarServer(
	organizationId: string
): Promise<RetrieveOrganizationCalendarResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `organization-calendar/${organizationId}`,
		init: { next: { tags: ['organization-calendar'] }, cache: 'no-store' },
	});
}

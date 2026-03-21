// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

export async function retrieveOrganizationCalendar(data: {
	organizationId: string;
	month?: number;
	year?: number;
}): Promise<
	RetrieveOrganizationCalendarResponse | ServerHandleResponse<false>
> {
	const query =
		data.month !== undefined && data.year !== undefined
			? `?month=${data.month}&year=${data.year}`
			: '';

	return await serverFetch({
		url: `organization-calendar/${data.organizationId}${query}`,
		init: { next: { tags: ['organization-calendar'] }, cache: 'no-store' },
	});
}

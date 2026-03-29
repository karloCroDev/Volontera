// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import {
	DashboardDurationDays,
	DashboardPaginatedUsersResponse,
	DashboardKPIMetricsResponse,
} from '@repo/types/dashboard';
import { ServerHandleResponse } from '@repo/types/general';

export async function retrieveDashboardKPIMetrics({
	durationDays = 30,
}: {
	durationDays?: DashboardDurationDays;
}): Promise<DashboardKPIMetricsResponse | ServerHandleResponse<false>> {
	const query = new URLSearchParams();
	query.set('durationDays', String(durationDays));

	return await serverFetch({
		url: `dashboard?${query.toString()}`,
		init: { cache: 'no-store' },
	});
}

export async function retrieveDashboardPaginatedUsers({
	offset = 0,
	limit = 10,
	filter,
}: {
	offset?: number;
	limit?: number;
	filter?: 'USER' | 'ORGANIZATION';
}): Promise<DashboardPaginatedUsersResponse | ServerHandleResponse<false>> {
	const query = new URLSearchParams();
	query.set('offset', String(offset));
	query.set('limit', String(limit));
	if (filter) query.set('filter', filter);

	return await serverFetch({
		url: `dashboard/users?${query.toString()}`,
		init: { cache: 'no-store' },
	});
}

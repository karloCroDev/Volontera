// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import {
	DashboardDurationDays,
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

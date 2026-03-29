// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Types
import {
	DashboardDurationDays,
	DashboardPaginatedUsersResponse,
	DashboardKPIMetricsResponse,
} from '@repo/types/dashboard';

export async function retrieveDashboardKPIMetrics({
	durationDays = 30,
}: {
	durationDays?: DashboardDurationDays;
} = {}): Promise<DashboardKPIMetricsResponse> {
	try {
		const res = await API().get('/dashboard', {
			params: {
				durationDays,
			},
		});
		return res.data;
	} catch (err) {
		catchError(err);
		throw err;
	}
}

export async function retrievePaginatedDashboardUsers({
	offset = 0,
	limit = 10,
	filter,
}: {
	offset?: number;
	limit?: number;
	filter?: 'USER' | 'ORGANIZATION';
}): Promise<DashboardPaginatedUsersResponse> {
	try {
		const res = await API().get('/dashboard/users', {
			params: {
				offset,
				limit,
				filter,
			},
		});

		return res.data;
	} catch (err) {
		catchError(err);
		throw err;
	}
}

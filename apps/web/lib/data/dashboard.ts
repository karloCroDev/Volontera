// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import { UserSchemaArgs } from '@repo/schemas/user';

// Types
import {
	DashboardDurationDays,
	DashboardPaginatedUsersResponse,
	DashboardKPIMetricsResponse,
} from '@repo/types/dashboard';
import { SuccessfulResponse } from '@repo/types/general';

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
	search,
}: {
	offset?: number;
	limit?: number;
	filter?: 'USER' | 'ORGANIZATION';
	search?: string;
}): Promise<DashboardPaginatedUsersResponse> {
	try {
		const res = await API().get('/dashboard/users', {
			params: {
				offset,
				limit,
				filter,
				search,
			},
		});

		return res.data;
	} catch (err) {
		catchError(err);
		throw err;
	}
}

export async function banDashboardUser(
	data: UserSchemaArgs
): Promise<SuccessfulResponse> {
	try {
		const res = await API().post('/dashboard/users/ban', data);
		return res.data;
	} catch (err) {
		catchError(err);
		throw err;
	}
}

export async function unbanDashboardUser(
	data: UserSchemaArgs
): Promise<SuccessfulResponse> {
	try {
		const res = await API().post('/dashboard/users/unban', data);
		return res.data;
	} catch (err) {
		catchError(err);
		throw err;
	}
}

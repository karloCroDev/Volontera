// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Types
import type {
	DashboardDurationDays,
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

// External packages
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Lib
import { retrieveDashboardKPIMetrics } from '@/lib/data/dashboard';

// Types
import {
	DashboardDurationDays,
	DashboardKPIMetricsResponse,
} from '@repo/types/dashboard';

export const dashboardQueryKeys = {
	all: ['dashboard'] as const,
	kpis: (durationDays: DashboardDurationDays) =>
		[...dashboardQueryKeys.all, 'kpis', durationDays] as const,
};

export const useDashboardKPIMetrics = (
	{
		durationDays = 30,
	}: {
		durationDays?: DashboardDurationDays;
	} = {},
	options?: Omit<
		UseQueryOptions<
			DashboardKPIMetricsResponse,
			Error,
			DashboardKPIMetricsResponse,
			ReturnType<typeof dashboardQueryKeys.kpis>
		>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: dashboardQueryKeys.kpis(durationDays),
		queryFn: () => retrieveDashboardKPIMetrics({ durationDays }),
		...options,
	});
};

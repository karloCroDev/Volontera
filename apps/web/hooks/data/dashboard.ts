// External packages
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Lib
import {
	retrieveDashboardKPIMetrics,
	retrievePaginatedDashboardUsers,
} from '@/lib/data/dashboard';

// Types
import {
	DashboardDurationDays,
	DashboardPaginatedUsersResponse,
	DashboardKPIMetricsResponse,
} from '@repo/types/dashboard';

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
			DashboardKPIMetricsResponse
		>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: ['dashboard', 'kpis', { durationDays }],
		queryFn: () => retrieveDashboardKPIMetrics({ durationDays }),
		...options,
	});
};

export const useDashboardPaginatedUsers = (
	{
		offset = 0,
		limit = 10,
		filter,
	}: {
		offset?: number;
		limit?: number;
		filter?: 'USER' | 'ORGANIZATION';
	} = {},
	options?: Omit<
		UseQueryOptions<
			DashboardPaginatedUsersResponse,
			Error,
			DashboardPaginatedUsersResponse
		>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: ['dashboard', 'users', { offset, limit, filter: filter ?? null }],
		queryFn: () => retrievePaginatedDashboardUsers({ offset, limit, filter }),
		...options,
	});
};

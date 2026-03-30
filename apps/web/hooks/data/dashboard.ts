// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	UseQueryOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import {
	banDashboardUser,
	retrieveDashboardKPIMetrics,
	retrievePaginatedDashboardUsers,
	unbanDashboardUser,
} from '@/lib/data/dashboard';
import { UserSchemaArgs } from '@repo/schemas/user';
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';

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
		search,
	}: {
		offset?: number;
		limit?: number;
		filter?: 'USER' | 'ORGANIZATION';
		search?: string;
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
		queryKey: [
			'dashboard',
			'users',
			{ offset, limit, filter: filter ?? null, search: search ?? null },
		],
		queryFn: () =>
			retrievePaginatedDashboardUsers({ offset, limit, filter, search }),
		...options,
	});
};

export const useBanOrUnbanDashboardUser = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		UserSchemaArgs & { shouldBan: boolean }
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['dashboard-user-ban-unban'],
		mutationFn: ({ userId, shouldBan }) =>
			shouldBan ? banDashboardUser({ userId }) : unbanDashboardUser({ userId }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['dashboard', 'users'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

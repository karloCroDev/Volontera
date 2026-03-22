// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	createOrganizationEvent,
	deleteOrganizationEvent,
	retrieveOrganizationCalendar,
	updateOrganizationEvent,
} from '@/lib/data/organization-calendar';

// Schemas
import {
	CreateOrganizationEventArgs,
	DeleteOrganizationEventArgs,
	RetrieveOrganizationCalendarArgs,
	UpdateOrganizationEventArgs,
} from '@repo/schemas/organization-calendar';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { RetrieveOrganizationCalendarResponse } from '@repo/types/organization-calendar';

export const useRetrieveOrganizationCalendar = (
	data: RetrieveOrganizationCalendarArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveOrganizationCalendarResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveOrganizationCalendarResponse>({
		queryKey: [
			data.organizationId,
			'organization-calendar',
			data.year ?? null,
			data.month ?? null,
		],
		queryFn: () => retrieveOrganizationCalendar(data),
		...options,
	});
};

export const useCreateOrganizationEvent = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateOrganizationEventArgs
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: ['create-organization-calendar-event'],
		mutationFn: (data: CreateOrganizationEventArgs) =>
			createOrganizationEvent(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				predicate: (query) => query.queryKey.includes('organization-calendar'),
			});

			await options?.onSuccess?.(...args);
		},
	});
};

export const useUpdateOrganizationEvent = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		UpdateOrganizationEventArgs
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: ['update-organization-calendar-event'],
		mutationFn: (data: UpdateOrganizationEventArgs) =>
			updateOrganizationEvent(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				predicate: (query) => query.queryKey.includes('organization-calendar'),
			});

			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteOrganizationEvent = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationEventArgs
	>
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: ['delete-organization-calendar-event'],
		mutationFn: (data: DeleteOrganizationEventArgs) =>
			deleteOrganizationEvent(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				predicate: (query) => query.queryKey.includes('organization-calendar'),
			});

			await options?.onSuccess?.(...args);
		},
	});
};

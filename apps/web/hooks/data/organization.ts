// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	createOrganization,
	listOrganizationsOrganizator,
	listOrganizationsUser,
	sendRequestToJoinOrganization,
	toggleFollowOrganization,
} from '@/lib/data/organization';

// Schemas
import {
	CreateOrganizationArgs,
	ToggleFollowOrganizationArgs,
	SendRequestToJoinOrganizationArgs,
} from '@repo/schemas/organization';

// Types
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';
import {
	CreateOrganizationResponse,
	ListOrganizationsOrganizatorResponse,
} from '@repo/types/organization';
import { DataWithFiles } from '@repo/types/upload';

export const useCreateOrganization = (
	options?: UseMutationOptions<
		CreateOrganizationResponse,
		ErrorFormResponse,
		DataWithFiles<CreateOrganizationArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['create-organization'],
		mutationFn: (data: DataWithFiles<CreateOrganizationArgs>) =>
			createOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export function useListOrganizations(
	role?: string,

	options?: Omit<
		UseQueryOptions<ListOrganizationsOrganizatorResponse>,
		'queryKey' | 'queryFn'
	>
) {
	return useQuery<ListOrganizationsOrganizatorResponse>({
		queryKey: ['organization', role],
		queryFn:
			role === 'ORGANIZATION'
				? listOrganizationsOrganizator
				: listOrganizationsUser,
		enabled: !!role,
		refetchOnWindowFocus: false,
		...options,
	});
}

export const useSendRequestToJoinOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		SendRequestToJoinOrganizationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['send-request-to-join-organization'],
		mutationFn: (data: SendRequestToJoinOrganizationArgs) =>
			sendRequestToJoinOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useToggleFollowOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		ToggleFollowOrganizationArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['follow-organization'],
		mutationFn: (data: ToggleFollowOrganizationArgs) =>
			toggleFollowOrganization(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

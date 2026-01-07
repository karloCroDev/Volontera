// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import {
	createOrganization,
	listOrganizationsOrganizator,
	listOrganizationsUser,
	sendRequestToJoinOrganization,
} from '@/lib/data/organization';

// Schemas
import {
	CreateOrganizationArgs,
	SendRequestToJoinOrganizationArgs,
} from '@repo/schemas/organization';

// Types
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { ListOrganizationsOrganizatorResponse } from '@repo/types/organization';
import { DataWithFiles } from '@repo/types/upload';

export const useCreateOrganization = (
	options?: UseMutationOptions<
		SuccessfulResponse,
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

export function useListOrganizations(role?: string) {
	return useQuery<ListOrganizationsOrganizatorResponse>({
		queryKey: ['organization', role],
		queryFn:
			role === 'ORGANIZATION'
				? listOrganizationsOrganizator
				: listOrganizationsUser,
		enabled: !!role,
		refetchOnWindowFocus: false,
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

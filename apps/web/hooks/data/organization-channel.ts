// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Schemas
import {
	CreateOrganizationChannelArgs,
	DeleteOrganizationChannelArgs,
	RetrieveOrganizationChannelsArgs,
	UpdateOrganizationChannelArgs,
} from '@repo/schemas/organization-channel';

// Lib
import {
	createOrganizationChannel,
	deleteOrganizationChannel,
	retrieveOrganizationChannels,
	updateOrganizationChannel,
} from '@/lib/data/organization-channel';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { RetrieveOrganizationChannelsResponse } from '@repo/types/organization-channel';

export const useRetrieveOrganizationChannels = (
	data: RetrieveOrganizationChannelsArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveOrganizationChannelsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveOrganizationChannelsResponse>({
		queryKey: ['organization-channels', data.organizationId],
		queryFn: () => retrieveOrganizationChannels(data),
		...options,
	});
};

export const useCreateOrganizationChannel = (
	organizationId?: string,
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateOrganizationChannelArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['create-organization-channel'],
		mutationFn: (data: CreateOrganizationChannelArgs) =>
			createOrganizationChannel(data),
		onSuccess: async (...args) => {
			if (organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-channels', organizationId],
				});
			}
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useUpdateOrganizationChannel = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		UpdateOrganizationChannelArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['update-organization-channel'],
		mutationFn: (data: UpdateOrganizationChannelArgs) =>
			updateOrganizationChannel(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-channels', args[1].organizationId],
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteOrganizationChannel = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationChannelArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-organization-channel'],
		mutationFn: (data: DeleteOrganizationChannelArgs) =>
			deleteOrganizationChannel(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-channels', args[1].organizationId],
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

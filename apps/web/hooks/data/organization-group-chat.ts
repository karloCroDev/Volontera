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
	DeleteOrganizationChannelMessageArgs,
	OrganizationChannelMessageArgs,
	RetrieveAllOrganizationChannelMessagesArgs,
} from '@repo/schemas/organization-channel-messages';

/// Lib
import {
	createGroupChatMessage,
	deleteOrganizationGroupChatMessage,
	retrieveAllOrganizationGroupChatMessages,
} from '@/lib/data/organization-group-chat';

// Types
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { DataWithFiles } from '@repo/types/upload';

export const useCreateOrganizationGroupChatMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DataWithFiles<OrganizationChannelMessageArgs>
	>
) => {
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: DataWithFiles<OrganizationChannelMessageArgs>) =>
			createGroupChatMessage(data),
		onSuccess: async (...args) => {
			// Handling with websockets
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteOrganizationGroupChatMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationChannelMessageArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: DeleteOrganizationChannelMessageArgs) =>
			deleteOrganizationGroupChatMessage(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-group-chat'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRetrieveAllOrganizationGroupChatMessages = (
	data: RetrieveAllOrganizationChannelMessagesArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllOrganizationGroupChatMessagesResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllOrganizationGroupChatMessagesResponse>({
		queryKey: ['organization-group-chat', data.organizationId],
		queryFn: () => retrieveAllOrganizationGroupChatMessages(data),
		...options,
	});
};

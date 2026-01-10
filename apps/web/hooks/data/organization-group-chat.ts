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
	DeleteOrganizationGroupChatMessageArgs,
	RetrieveAllOrganizationGroupChatMessagesArgs,
} from '@repo/schemas/organization-group-chat';

/// Lib
import {
	createGroupChatMessage,
	deleteOrganizationGroupChatMessage,
	retrieveAllOrganizationGroupChatMessages,
} from '@/lib/data/organization-group-chat';

// Schemas
import { MessageArgs } from '@repo/schemas/direct-messages';

// Types
import { RetrieveAllOrganizationGroupChatMessagesResponse } from '@repo/types/organization-group-chat';
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { DataWithFiles } from '@repo/types/upload';

export const useCreateOrganizationGroupChatMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DataWithFiles<MessageArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: DataWithFiles<Omit<MessageArgs, 'participantId'>>) =>
			createGroupChatMessage(data),
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

export const useDeleteOrganizationGroupChatMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationGroupChatMessageArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['accept-or-decline-request'],
		mutationFn: (data: DeleteOrganizationGroupChatMessageArgs) =>
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
	data: RetrieveAllOrganizationGroupChatMessagesArgs,
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

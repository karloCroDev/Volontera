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

// Lib
import {
	createOrganizationChannelMessage,
	deleteOrganizationChannelMessage,
	retrieveAllOrganizationChannelMessages,
} from '@/lib/data/organization-channel-messages';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { RetrieveAllOrganizationChannelMessagesResponse } from '@repo/types/organization-channel-messages';
import { DataWithFiles } from '@repo/types/upload';

export const useCreateOrganizationChannelMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DataWithFiles<OrganizationChannelMessageArgs>
	>
) => {
	return useMutation({
		mutationKey: ['create-organization-channel-message'],
		mutationFn: (data: DataWithFiles<OrganizationChannelMessageArgs>) =>
			createOrganizationChannelMessage(data),
		onSuccess: async (...args) => {
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteOrganizationChannelMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationChannelMessageArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-organization-channel-message'],
		mutationFn: (data: DeleteOrganizationChannelMessageArgs) =>
			deleteOrganizationChannelMessage(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-channel-messages'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRetrieveAllOrganizationChannelMessages = (
	data: RetrieveAllOrganizationChannelMessagesArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllOrganizationChannelMessagesResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllOrganizationChannelMessagesResponse>({
		queryKey: [
			'organization-channel-messages',
			data.organizationId,
			data.groupChatId,
		],
		queryFn: () => retrieveAllOrganizationChannelMessages(data),
		...options,
	});
};

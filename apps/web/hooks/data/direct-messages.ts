// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	getListOfAllDirectMessages,
	getDirectMessagesConversationById,
	searchAllUsers,
	startConversationOrStartAndSendDirectMessage,
} from '@/lib/data/direct-messages';

import {
	SearchArgs,
	ConversationArgs,
	MessageArgs,
} from '@repo/schemas/direct-messages';

// Types
import { DataWithFiles } from '@repo/types/upload';
import { ErrorToastResponse } from '@repo/types/general';
import {
	GetDirectMessagesConversationByIdResponse,
	SearchUsersResponse,
	StartConversationOrStartAndSendDirectMessageResonse,
} from '@repo/types/direct-messages';

export const useGetListOfDirectMessages = (
	options?: Omit<UseSuspenseQueryOptions<boolean>, 'queryKey' | 'queryFn'>
) => {
	return useSuspenseQuery({
		queryKey: ['direct-messages'],
		queryFn: getListOfAllDirectMessages,
		...options,
	});
};

export const useSearchAllUsers = (
	data: SearchArgs,
	options?: Omit<UseQueryOptions<SearchUsersResponse>, 'queryKey' | 'queryFn'>
) => {
	return useQuery<SearchUsersResponse>({
		queryKey: ['direct-messages-search', data.query],
		queryFn: () => searchAllUsers(data),
		...options,
	});
};

export const useGetDirectMessagesConversationById = (
	data: ConversationArgs,
	options?: Omit<
		UseQueryOptions<GetDirectMessagesConversationByIdResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<GetDirectMessagesConversationByIdResponse>({
		queryKey: ['direct-messages-conversation', data.conversationId],
		queryFn: () => getDirectMessagesConversationById(data),
		...options,
	});
};

export const useStartConversationOrStartAndSendDirectMessage = (
	options?: UseMutationOptions<
		StartConversationOrStartAndSendDirectMessageResonse,
		ErrorToastResponse,
		DataWithFiles<MessageArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['direct-messages-conversation'],
		mutationFn: (values: DataWithFiles<MessageArgs>) =>
			startConversationOrStartAndSendDirectMessage(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

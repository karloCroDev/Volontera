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
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import { SearchUsersResponse } from '@repo/types/direct-messages';

export const useGetListOfDirectMessages = (
	options?: Omit<UseSuspenseQueryOptions<boolean>, 'queryKey' | 'queryFn'>
) => {
	return useSuspenseQuery({
		queryKey: ['direct-messages'],
		queryFn: getListOfAllDirectMessages,
		...options,
	});
};

export const useSearchAllUsers = (data: SearchArgs) => {
	const q = data.query?.trim() ?? '';

	return useQuery<SearchUsersResponse>({
		queryKey: ['direct-messages-search', q],
		queryFn: () => searchAllUsers({ ...data, query: q }),
		enabled: q.length > 0,
		refetchOnWindowFocus: false,
	});
};

export const useGetDirectMessagesConversationById = (
	data: ConversationArgs,
	options?: Omit<UseSuspenseQueryOptions<boolean>, 'queryKey' | 'queryFn'>
) => {
	return useSuspenseQuery({
		queryKey: ['direct-messages-conversation', data.conversationId],
		queryFn: () => getDirectMessagesConversationById(data),
		...options,
	});
};

export const useStartConversationOrStartAndSendDirectMessage = (
	options?: UseMutationOptions<
		SuccessfulResponse,
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
			await queryClient.invalidateQueries({ queryKey: ['notifications'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

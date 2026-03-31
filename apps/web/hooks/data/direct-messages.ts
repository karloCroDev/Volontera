// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
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
	deleteDirectMessageById,
	createDirectMessageReply,
} from '@/lib/data/direct-messages';

// Schemas
import {
	SearchArgs,
	ConversationArgs,
	MessageArgs,
	DeleteDirectMessageArgs,
	CreateReplyArgs,
} from '@repo/schemas/direct-messages';

// Types
import { DataWithFiles } from '@repo/types/upload';
import { ErrorToastResponse } from '@repo/types/general';
import {
	GetDirectMessagesConversationByIdResponse,
	ListConversationsResponse,
	SearchUsersResponse,
	StartConversationOrStartAndSendDirectMessageResonse,
} from '@repo/types/direct-messages';

export const useGetListOfDirectMessages = (
	options?: Omit<
		UseSuspenseQueryOptions<ListConversationsResponse>,
		'queryKey' | 'queryFn'
	>
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
		queryKey: ['direct-messages-conversation', data.recieverId],
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
	return useMutation({
		mutationKey: ['direct-messages-conversation'],
		mutationFn: (values: DataWithFiles<MessageArgs>) =>
			startConversationOrStartAndSendDirectMessage(values),
		...options,
	});
};

export const useDeleteDirectMessageById = (
	options?: UseMutationOptions<
		StartConversationOrStartAndSendDirectMessageResonse,
		ErrorToastResponse,
		DeleteDirectMessageArgs
	>
) => {
	return useMutation({
		mutationKey: ['direct-messages-conversation'],
		mutationFn: (values: DeleteDirectMessageArgs) =>
			deleteDirectMessageById(values),
		...options,
	});
};

export const useCreateDirectMessageReply = (
	options?: UseMutationOptions<
		StartConversationOrStartAndSendDirectMessageResonse,
		ErrorToastResponse,
		DataWithFiles<CreateReplyArgs>
	>
) => {
	return useMutation({
		mutationKey: ['direct-messages-reply'],
		mutationFn: (values: DataWithFiles<CreateReplyArgs>) =>
			createDirectMessageReply(values),
		...options,
	});
};

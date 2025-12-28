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
	addHelpQuestion,
	deleteHelpConversation,
	getHelpConversation,
} from '@/lib/data/help';

// Schemas
import { HelpConversationSchemaArgs } from '@repo/schemas/help';
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';

// Types
import { HelpConversationSuccess, RetrieveAIResponse } from '@repo/types/help';

export const useGetHelpConversation = (
	options?: Omit<
		UseSuspenseQueryOptions<HelpConversationSuccess>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery({
		queryKey: ['help'],
		queryFn: getHelpConversation,
		...options,
	});
};

export const useAddHelpQuestion = (
	options?: UseMutationOptions<
		RetrieveAIResponse,
		ErrorToastResponse,
		HelpConversationSchemaArgs,
		{ previous: HelpConversationSuccess | undefined }
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['add-conversation-question'],
		mutationFn: (values: HelpConversationSchemaArgs) => addHelpQuestion(values),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['help'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDeleteHelpConversation = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		HelpConversationSchemaArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-conversation'],
		mutationFn: deleteHelpConversation,
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['help'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

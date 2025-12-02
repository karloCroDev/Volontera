// External packages
import {
	addHelpQuestion,
	deleteHelpConversation,
	getHelpConversation,
} from '@/lib/data/help';
import { HelpConversationSchemaArgs } from '@repo/schemas/help';
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

export const useGetHelpConversation = () => {
	return useQuery({
		queryKey: ['help'],
		queryFn: getHelpConversation,
		staleTime: 5 * 60 * 1000,
	});
};

export const useAddHelpQuestion = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		HelpConversationSchemaArgs
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

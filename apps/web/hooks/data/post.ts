// External packages
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from '@tanstack/react-query';

// Lib
import { createPost } from '@/lib/data/post';

// Types
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';
import { DataWithFile, DataWithFiles } from '@repo/types/upload';

// Schemas
import { CreatePostArgs } from '@repo/schemas/post';

export const useCreatePost = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		DataWithFile<CreatePostArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['create-post'],
		// mutation receives a single variable object { data, file }
		mutationFn: (data: Required<DataWithFiles<CreatePostArgs>>) =>
			createPost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['posts'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

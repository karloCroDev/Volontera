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
	createPost,
	deletePost,
	dislikePost,
	likePost,
	retrieveOrganizationPosts,
	retrievePostData,
	retrievePostWithComments,
	updatePost,
} from '@/lib/data/post';

// Types
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';
import { DataWithFile, DataWithFiles } from '@repo/types/upload';

// Schemas
import {
	CreatePostArgs,
	DeletePostArgs,
	LikeOrDislikePostArgs,
	RetrievePostArgs,
	UpdatePostArgs,
} from '@repo/schemas/post';
import {
	RetrieveOrganizationPostsResponse,
	RetrievePostData,
} from '@repo/types/post';

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

export const useDeletePost = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeletePostArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['delete-post'],
		mutationFn: (data: DeletePostArgs) => deletePost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['posts'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useLikePost = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		LikeOrDislikePostArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['like-post'],
		mutationFn: (data: LikeOrDislikePostArgs) => likePost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['posts'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useDislikePost = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		LikeOrDislikePostArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['dislike-post'],
		mutationFn: (data: LikeOrDislikePostArgs) => dislikePost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['posts'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRetrieveOrganizationPosts = (
	organizationId: string,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveOrganizationPostsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery({
		queryKey: ['posts', organizationId],
		queryFn: () => retrieveOrganizationPosts({ organizationId }),
		...options,
	});
};

export const useRetrievePostWithComments = (
	postId: string,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveOrganizationPostsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery({
		queryKey: ['posts', postId],
		queryFn: () => retrievePostWithComments({ postId }),
		...options,
	});
};

export const useUpadatePost = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		DataWithFiles<UpdatePostArgs>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['update-post'],
		// mutation receives a single variable object { data, files }
		mutationFn: (data: DataWithFiles<UpdatePostArgs>) => updatePost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['posts'] });
			await options?.onSuccess?.(...args);
		},
		...options,
	});
};

export const useRetrievePostData = (
	postId: RetrievePostArgs['postId'],
	options?: Omit<UseQueryOptions<RetrievePostData>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		queryKey: ['post-data', postId],
		queryFn: () => retrievePostData({ postId }),
		...options,
	});
};

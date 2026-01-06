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
	retrieveOrganizationPosts,
	retrievePostData,
	retrievePostWithComments,
	toggleLike,
	updatePost,
} from '@/lib/data/post';

// Types
import {
	ErrorFormResponse,
	ErrorToastResponse,
	SuccessfulResponse,
} from '@repo/types/general';
import { DataWithFiles } from '@repo/types/upload';

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
	organizationId: string,
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorFormResponse,
		Required<DataWithFiles<CreatePostArgs>>
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-post'],
		// mutation receives a single variable object { data, file }
		mutationFn: (data: Required<DataWithFiles<CreatePostArgs>>) =>
			createPost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['posts', organizationId],
			});
			await options?.onSuccess?.(...args);
		},
	});
};

// Optimistic update za brisanje posta (implementiran unutar componenata)
export const useDeletePost = (
	postId: DeletePostArgs['postId'],
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeletePostArgs
	>
) => {
	return useMutation({
		...options,
		mutationKey: ['delete-post'],
		mutationFn: () => deletePost({ postId }),
	});
};

export const useToggleLike = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		LikeOrDislikePostArgs,
		{ previousPost: RetrieveOrganizationPostsResponse | undefined }
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['like-post'],
		mutationFn: (data: LikeOrDislikePostArgs) => toggleLike(data),

		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['posts'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
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
		...options,
		queryKey: ['post-with-comments', postId],
		queryFn: () => retrievePostWithComments({ postId }),
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
		...options,
		mutationKey: ['update-post'],
		// mutation receives a single variable object { data, files }
		mutationFn: (data: DataWithFiles<UpdatePostArgs>) => updatePost(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({ queryKey: ['post-with-comments'] });
			await options?.onSuccess?.(...args);
		},
	});
};

export const useRetrievePostData = (
	postId: RetrievePostArgs['postId'],
	options?: Omit<UseQueryOptions<RetrievePostData>, 'queryKey' | 'queryFn'>
) => {
	return useQuery({
		...options,
		queryKey: ['post-data', postId],
		queryFn: () => retrievePostData({ postId }),
	});
};

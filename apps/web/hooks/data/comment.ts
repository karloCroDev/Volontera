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
	createComment,
	createReply,
	deleteComment,
	deleteReply,
	toggleLikeComment,
	retrieveCommentReplies,
	retrievePostComments,
} from '@/lib/data/comment';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';

// Schemas
import {
	PostCommentsResponse,
	PostCommentRepliesResponse,
} from '@repo/types/comment';
import {
	CreateCommentArgs,
	CreateReplyArgs,
	DeleteCommentArgs,
	DeleteReplyArgs,
	LikeOrDislikeCommentArgs,
	RetrievePostCommentsArgs,
} from '@repo/schemas/comment';

export const useRetrievePostComments = (
	postId: RetrievePostCommentsArgs['postId'],
	options?: Omit<
		UseSuspenseQueryOptions<PostCommentsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery({
		queryKey: ['comments', postId],
		queryFn: () => retrievePostComments({ postId }),
		...options,
	});
};

export const useCreateComment = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateCommentArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-comment'],
		// mutation receives a single variable object { data, file }
		mutationFn: (data: CreateCommentArgs) => createComment({ data }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['comments'],
			});
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteComment = (
	commentId: DeleteCommentArgs['commentId'],
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteCommentArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-comment'],

		mutationFn: () => deleteComment({ commentId }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['comments'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

export const useToggleLikeComments = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		LikeOrDislikeCommentArgs
		// { previousPost: RetrieveOrganizationPostsResponse | undefined } Handle this better when I am going to implement optimistic updates
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['like-comment'],
		mutationFn: (data: LikeOrDislikeCommentArgs) => toggleLikeComment(data),

		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['comments'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

export const useRetrieveCommentReplies = (
	commentId: string,
	options?: Omit<
		UseQueryOptions<PostCommentRepliesResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery({
		queryKey: ['replies', commentId],
		queryFn: () => retrieveCommentReplies({ commentId }),
		...options,
	});
};

// See if I need to be specific with revalidation!
export const useCreateReply = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateReplyArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-reply'],
		// mutation receives a single variable object { data, file }
		mutationFn: (data: CreateReplyArgs) => createReply(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['replies'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteReply = (
	replyId: DeleteReplyArgs['replyId'],
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteReplyArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-reply'],
		mutationFn: () => deleteReply({ replyId }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['replies'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

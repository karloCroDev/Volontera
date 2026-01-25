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

const findPostCommentsCacheEntryByCommentId = (
	queryClient: ReturnType<typeof useQueryClient>,
	commentId: string
) => {
	const queries = queryClient.getQueriesData<PostCommentsResponse>({
		queryKey: ['comments'],
	});

	for (const [queryKey, data] of queries) {
		const maybePostId = (queryKey as unknown as [string, string])[1];
		const comment = data?.comments?.find((c) => c.id === commentId);
		if (comment) {
			return {
				postId: comment.postId ?? maybePostId,
				repliesCount: comment._count?.postCommentsReplies,
			};
		}
	}

	return undefined;
};

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
				queryKey: ['comments', args[1].postId],
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
		void,
		{ previousPost: PostCommentsResponse }
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-comment'],

		mutationFn: () => deleteComment({ commentId }),
		onSuccess: async (...args) => {
			const cacheEntry = findPostCommentsCacheEntryByCommentId(
				queryClient,
				commentId
			);
			if (cacheEntry?.postId) {
				await queryClient.invalidateQueries({
					queryKey: ['comments', cacheEntry.postId],
				});
			} else {
				await queryClient.invalidateQueries({ queryKey: ['comments'] });
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useToggleLikeComment = (
	commentId: LikeOrDislikeCommentArgs['commentId'],
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		LikeOrDislikeCommentArgs,
		{ previousPost: PostCommentsResponse }
	>
) => {
	return useMutation({
		...options,
		mutationKey: ['like-comment'],
		mutationFn: () => toggleLikeComment({ commentId }),

		onSuccess: async (...args) => {
			// Handling optimistic updates in the component
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
		mutationFn: (data: CreateReplyArgs) => createReply(data),
		onSuccess: async (...args) => {
			const commentId = args[1].commentId;
			const cacheEntry = findPostCommentsCacheEntryByCommentId(
				queryClient,
				commentId
			);

			// Always refresh replies for that specific comment
			await queryClient.invalidateQueries({
				queryKey: ['replies', commentId],
			});

			// If this was the first reply (0 -> 1), refresh comments to update reply counter
			if (cacheEntry?.postId && cacheEntry.repliesCount === 0) {
				await queryClient.invalidateQueries({
					queryKey: ['comments', cacheEntry.postId],
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteReply = (
	{
		replyId,
		commentId,
	}: {
		replyId: DeleteReplyArgs['replyId'];
		commentId: string;
	},
	options?: UseMutationOptions<SuccessfulResponse, ErrorToastResponse>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-reply'],
		mutationFn: () => deleteReply({ replyId }),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['replies', commentId],
			});
			await options?.onSuccess?.(...args);
		},
	});
};

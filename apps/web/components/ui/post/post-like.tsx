'use client';

// External packages
import * as React from 'react';
import { Heart } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useDislikePost, useLikePost } from '@/hooks/data/post';

// Types
import {
	RetrieveOrganizationPostsResponse,
	RetrievePostWithComments,
} from '@repo/types/post';
import { RetrieveHomePostsResponse } from '@repo/types/home';
import { ErrorToastResponse } from '@repo/types/general';

// Lib
import { toast } from '@/lib/utils/toast';

type PostLikeItem = {
	id: string;
	postLikes: Array<{ userId: string; postId?: string }>;
	_count: { postLikes: number };
};

type LikeContext = {
	previousLocal: { count: number; hasUserLiked: boolean };
	previousQueries: Array<[QueryKey, unknown]>;
};

const isPostQueryKey = (queryKey: QueryKey): boolean => {
	const root = queryKey[0];
	return root === 'posts' || root === 'home' || root === 'post-with-comments';
};

const toggleLikeInPost = (post: PostLikeItem, userId: string): PostLikeItem => {
	const userHasLiked = post.postLikes.some((like) => like.userId === userId);

	return {
		...post,
		postLikes: userHasLiked
			? post.postLikes.filter((like) => like.userId !== userId)
			: [...post.postLikes, { userId, postId: post.id }],
		_count: {
			...post._count,
			postLikes: userHasLiked
				? post._count.postLikes - 1
				: post._count.postLikes + 1,
		},
	};
};

export const PostLike: React.FC<{
	count: number;
	hasUserLiked: boolean;
	postId: string;
}> = ({ count, hasUserLiked, postId }) => {
	const queryClient = useQueryClient();
	const { data: user } = useSession();

	const [optimisticCount, setOptimisticCount] = React.useState(count);
	const [optimisticHasUserLiked, setOptimisticHasUserLiked] =
		React.useState(hasUserLiked);

	const updatePostCaches = React.useCallback(
		(targetPostId: string, userId: string) => {
			queryClient.setQueriesData(
				{ predicate: (query) => isPostQueryKey(query.queryKey) },
				(oldData: unknown) => {
					if (!oldData || typeof oldData !== 'object') return oldData;

					const maybeHome = oldData as InfiniteData<RetrieveHomePostsResponse>;
					if (Array.isArray(maybeHome.pages)) {
						return {
							...maybeHome,
							pages: maybeHome.pages.map((page) => ({
								...page,
								posts: page.posts.map((post) =>
									post.id === targetPostId
										? toggleLikeInPost(post, userId)
										: post
								),
							})),
						};
					}

					const maybePosts = oldData as RetrieveOrganizationPostsResponse;
					if (Array.isArray(maybePosts.posts)) {
						return {
							...maybePosts,
							posts: maybePosts.posts.map((post) =>
								post.id === targetPostId ? toggleLikeInPost(post, userId) : post
							),
						};
					}

					const maybePost = oldData as RetrievePostWithComments;
					if (maybePost.post && maybePost.post.id === targetPostId) {
						return {
							...maybePost,
							post: toggleLikeInPost(maybePost.post, userId),
						};
					}

					return oldData;
				}
			);
		},
		[queryClient]
	);

	const onMutate = async ({ postId: targetPostId }: { postId: string }) => {
		if (!user?.id) {
			toast({
				title: 'Not signed in',
				content: 'Please sign in to like posts.',
				variant: 'error',
			});
			return {
				previousLocal: {
					count: optimisticCount,
					hasUserLiked: optimisticHasUserLiked,
				},
				previousQueries: [],
			} satisfies LikeContext;
		}

		await queryClient.cancelQueries({
			predicate: (query) => isPostQueryKey(query.queryKey),
		});

		const previousQueries = queryClient.getQueriesData({
			predicate: (query) => isPostQueryKey(query.queryKey),
		});

		const previousLocal = {
			count: optimisticCount,
			hasUserLiked: optimisticHasUserLiked,
		};

		setOptimisticHasUserLiked((prev) => !prev);
		setOptimisticCount((prev) => prev + (previousLocal.hasUserLiked ? -1 : 1));

		updatePostCaches(targetPostId, user.id);

		return { previousLocal, previousQueries } satisfies LikeContext;
	};

	const onError = (
		{ message, title }: ErrorToastResponse,
		_: { postId: string },
		context: LikeContext | undefined
	) => {
		if (context?.previousLocal) {
			setOptimisticCount(context.previousLocal.count);
			setOptimisticHasUserLiked(context.previousLocal.hasUserLiked);
		}

		if (context?.previousQueries?.length) {
			for (const [queryKey, data] of context.previousQueries) {
				queryClient.setQueryData(queryKey, data);
			}
		}

		toast({
			title,
			content: message,
			variant: 'error',
		});
	};

	const onSettled = () => {
		queryClient.invalidateQueries({
			predicate: (query) => isPostQueryKey(query.queryKey),
		});
	};

	const likeMutation = useLikePost({ onMutate, onError, onSettled });
	const dislikeMutation = useDislikePost({ onMutate, onError, onSettled });
	const isPending = likeMutation.isPending || dislikeMutation.isPending;

	return (
		<div className="ml-auto flex items-center gap-4" suppressHydrationWarning>
			<Button
				size="xs"
				variant="blank"
				isDisabled={isPending}
				onPress={() => {
					if (optimisticHasUserLiked) {
						dislikeMutation.mutate({ postId });
						return;
					}

					likeMutation.mutate({ postId });
				}}
			>
				<Heart
					suppressHydrationWarning
					fill={optimisticHasUserLiked ? '#f59f0a' : 'none'}
					className={twJoin(
						'cursor-pointer',
						optimisticHasUserLiked
							? 'text-primary'
							: 'text-background-foreground'
					)}
				/>
			</Button>
			<p
				className="text-sm font-semibold italic underline underline-offset-4"
				suppressHydrationWarning
			>
				{optimisticCount}
			</p>
		</div>
	);
};

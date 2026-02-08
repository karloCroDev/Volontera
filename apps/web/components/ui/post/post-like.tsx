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
import { useToggleLike } from '@/hooks/data/post';

// Types
import {
	RetrieveOrganizationPostsResponse,
	RetrievePostWithComments,
} from '@repo/types/post';
import { RetrieveHomePostsResponse } from '@repo/types/home';

// Lib
import { toast } from '@/lib/utils/toast';

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
	const toggleInPost = React.useCallback(
		<
			T extends {
				id: string;
				postLikes: Array<{ userId: string; postId?: string }>;
				_count: { postLikes: number };
			},
		>(
			post: T
		): T => {
			if (!user?.id) return post;
			const userHasLiked = post.postLikes.some(
				(like) => like.userId === user.id
			);
			return {
				...post,
				postLikes: userHasLiked
					? post.postLikes.filter((like) => like.userId !== user.id)
					: [...post.postLikes, { userId: user.id, postId: post.id }],
				_count: {
					...post._count,
					postLikes: userHasLiked
						? post._count.postLikes - 1
						: post._count.postLikes + 1,
				},
			};
		},
		[user?.id]
	);

	const updateAllCaches = React.useCallback(
		(targetPostId: string) => {
			if (!user?.id) return;

			// 1) Organization posts lists (any key starting with 'posts')
			queryClient.setQueriesData(
				{ queryKey: ['posts'], exact: false },
				(oldData: RetrieveOrganizationPostsResponse | undefined) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						posts: oldData.posts.map((post) =>
							post.id === targetPostId ? toggleInPost(post) : post
						),
					};
				}
			);

			// 2) Home feed (infinite query, any key starting with 'home')
			queryClient.setQueriesData(
				{ queryKey: ['home'], exact: false },
				(oldData: InfiniteData<RetrieveHomePostsResponse> | undefined) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							posts: page.posts.map((post) =>
								post.id === targetPostId ? toggleInPost(post) : post
							),
						})),
					};
				}
			);

			// 3) Single post w/ comments (any key starting with 'post-with-comments')
			queryClient.setQueriesData(
				{ queryKey: ['post-with-comments'], exact: false },
				(oldData: RetrievePostWithComments | undefined) => {
					if (!oldData?.post) return oldData;
					if (oldData.post.id !== targetPostId) return oldData;
					return {
						...oldData,
						post: toggleInPost(oldData.post),
					};
				}
			);
		},
		[queryClient, toggleInPost, user?.id]
	);

	type LikeContext = {
		previousLocal: { count: number; hasUserLiked: boolean };
		previousQueries: Array<[QueryKey, unknown]>;
	};

	const { mutate, isPending } = useToggleLike({
		onMutate: async ({ postId: targetPostId }) => {
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

			await Promise.all([
				queryClient.cancelQueries({ queryKey: ['posts'], exact: false }),
				queryClient.cancelQueries({ queryKey: ['home'], exact: false }),
				queryClient.cancelQueries({
					queryKey: ['post-with-comments'],
					exact: false,
				}),
			]);

			const previousQueries = [
				...queryClient.getQueriesData({ queryKey: ['posts'], exact: false }),
				...queryClient.getQueriesData({ queryKey: ['home'], exact: false }),
				...queryClient.getQueriesData({
					queryKey: ['post-with-comments'],
					exact: false,
				}),
			] as Array<[QueryKey, unknown]>;

			const previousLocal = {
				count: optimisticCount,
				hasUserLiked: optimisticHasUserLiked,
			};

			// Local optimistic UI (works even when the parent is a server component)
			setOptimisticHasUserLiked((prev) => !prev);
			setOptimisticCount(
				(prev) => prev + (previousLocal.hasUserLiked ? -1 : 1)
			);

			// Cache optimistic update (keeps lists consistent across pages)
			updateAllCaches(targetPostId);

			return { previousLocal, previousQueries } satisfies LikeContext;
		},

		onError: ({ message, title }, _, context) => {
			if (context?.previousLocal) {
				setOptimisticCount(context.previousLocal.count);
				setOptimisticHasUserLiked(context.previousLocal.hasUserLiked);
			}

			if (context?.previousQueries?.length) {
				for (const [key, data] of context.previousQueries) {
					queryClient.setQueryData(key, data);
				}
			}

			toast({
				title,
				content: message,
				variant: 'error',
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['home'], exact: false });
			queryClient.invalidateQueries({
				queryKey: ['post-with-comments'],
				exact: false,
			});
		},
	});

	return (
		<div className="ml-auto flex items-center gap-4" suppressHydrationWarning>
			<Button
				size="xs"
				variant="blank"
				isDisabled={isPending}
				onPress={() => {
					mutate({ postId });
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

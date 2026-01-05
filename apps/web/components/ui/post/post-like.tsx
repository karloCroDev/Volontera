'use client';

// External packages
import * as React from 'react';
import { Heart } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useToggleLike } from '@/hooks/data/post';

// Types
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';

// Lib
import { toast } from '@/lib/utils/toast';

export const PostLike: React.FC<{
	count: number;
	hasUserLiked: boolean;
	postId: string;
}> = ({ count, hasUserLiked, postId }) => {
	const queryClient = useQueryClient();

	const { data: user } = useSession();

	const params = useParams<{ organizationId: string }>();

	// Optimistic update za like/dislike. Uglavnom kada želim prikazati instant feedback korisniku da je lajkao ili dislajkao post.

	// TODO: Currently, this won't work in home or if it is a single post (yeah)
	const { mutate } = useToggleLike({
		onMutate: async (likeStatus) => {
			await queryClient.cancelQueries({ queryKey: ['posts'] });

			const previousPost = queryClient.getQueryData([
				'posts',
				params.organizationId,
			]) as RetrieveOrganizationPostsResponse;

			queryClient.setQueryData(
				['posts', params.organizationId],
				(old: RetrieveOrganizationPostsResponse) => ({
					...old,
					posts: old.posts.map((post) =>
						post.id === likeStatus.postId
							? {
									...post,
									postLikes: post.postLikes.find(
										(like) => like.userId === user?.id
									)
										? post.postLikes.filter((like) => like.userId !== user?.id)
										: [
												...post.postLikes,
												{ userId: user?.id, postId: post.id },
											],
									_count: {
										...post._count,
										postLikes: hasUserLiked
											? post._count.postLikes - 1
											: post._count.postLikes + 1,
									},
								}
							: post
					),
				})
			);

			// Return a context object with the snapshotted value
			return { previousPost };
		},

		// 2. If the mutation fails:
		onError: ({ message, title }, _, context) => {
			queryClient.setQueryData(['posts'], context?.previousPost);
			toast({
				title,
				content: message,
				variant: 'error',
			});
		},

		// 3. Always refetch after error or success to sync with server:
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'], exact: false });
		},
	});

	return (
		<div className="ml-auto flex items-center gap-4">
			<Button
				variant="blank"
				onPress={() => {
					mutate({ postId });
				}}
			>
				<Heart
					fill={hasUserLiked ? '#f59f0a' : 'none'}
					className={twJoin(
						'cursor-pointer',
						hasUserLiked ? 'text-primary' : 'text-background-foreground'
					)}
				/>
			</Button>
			<p className="font-semibold italic underline underline-offset-4">
				{count}
			</p>
		</div>
	);
};

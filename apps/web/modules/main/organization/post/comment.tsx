'use client';

// External packages
import * as React from 'react';
import { ChevronRight, Heart, Reply } from 'lucide-react';
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Collapsible } from '@/components/ui/collapsible';

// Modules
import { RepliesMapping } from '@/modules/main/organization/post/replies-mapping';

// Lib
import { formatTime } from '@/lib/utils/time-adjustments';
import { convertToFullname } from '@/lib/utils/converter';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useToggleLikeComment } from '@/hooks/data/comment';

// Types
import { PostCommentsResponse } from '@repo/types/comment';

// Lib
import { toast } from '@/lib/utils/toast';
import { CommentDelete } from '@/modules/main/organization/post/comment-delete';

export const Comment: React.FC<{
	comment: PostCommentsResponse['comments'][0];
	hasUserLiked: boolean;
	pfpImages?: Record<string, string>;
}> = ({ comment, hasUserLiked, pfpImages }) => {
	const pathname = usePathname();
	const params = useParams<{ postId: string }>();
	const searchParams = useSearchParams();
	const router = useRouter();

	// Ažuriram cache nakon brisanja komentara

	const { data: user } = useSession();

	const queryClient = useQueryClient();

	// Optimistic update za like/dislike komentara
	const { mutate: mutateLikeComment } = useToggleLikeComment(comment.id, {
		onMutate: async (likeStatus) => {
			await queryClient.cancelQueries({
				queryKey: ['comments', params.postId],
			});

			const previousPost = queryClient.getQueryData([
				'comments',
			]) as PostCommentsResponse;

			queryClient.setQueryData(
				['comments', params.postId],
				(old: PostCommentsResponse) => ({
					...old,
					comments: old.comments.map((comment) =>
						comment.id === likeStatus.commentId
							? {
									...comment,
									postCommentsLikes: comment.postCommentsLikes.find(
										(like) => like.userId === user?.id
									)
										? comment.postCommentsLikes.filter(
												(like) => like.userId !== user?.id
											)
										: [
												...comment.postCommentsLikes,
												{ userId: user?.id, commentId: comment.id },
											],
									_count: {
										...comment._count,
										postCommentsLikes: hasUserLiked
											? comment._count.postCommentsLikes - 1
											: comment._count.postCommentsLikes + 1,
									},
								}
							: comment
					),
				})
			);

			return { previousPost };
		},

		onError: ({ message, title }, _, context) => {
			queryClient.setQueryData(
				['comments', params.postId],
				context?.previousPost
			);
			toast({
				title,
				content: message,
				variant: 'error',
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['comments', params.postId] });
		},
	});

	return (
		<div className="border-b-input-border border-b py-4">
			<div className="flex items-center gap-4">
				<Avatar
					imageProps={{
						src: pfpImages ? pfpImages[comment.author.image || ''] : undefined,
					}}
					colorScheme="gray"
				>
					{convertToFullname({
						firstname: comment.author.firstName || '',
						lastname: comment.author.lastName || '',
					})}
				</Avatar>

				<div>
					<p className="text-muted-foreground text-xs">
						{convertToFullname({
							firstname: comment.author.firstName || '',
							lastname: comment.author.lastName || '',
						})}{' '}
						| {formatTime(new Date(comment.createdAt))}
					</p>
					<p>{comment.content}</p>
				</div>

				<div className="ml-auto flex items-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<p suppressHydrationWarning>{comment._count.postCommentsLikes}</p>
						<Button
							variant="blank"
							className="p-0"
							onPress={() => {
								mutateLikeComment({ commentId: comment.id });
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
					</div>

					<Button
						variant={
							searchParams.get('commentId') === comment.id ? 'primary' : 'ghost'
						}
						size="xs"
						className="p-0 px-2 py-0.5"
						isFullyRounded
						onPress={() => {
							const params = new URLSearchParams(searchParams.toString());
							if (searchParams.get('commentId') === comment.id) {
								params.delete('commentId');
								params.delete('replyTo');
							} else {
								params.set('commentId', comment.id);
								params.set(
									'replyTo',
									convertToFullname({
										firstname: comment.author.firstName || '',
										lastname: comment.author.lastName || '',
									})
								);
							}

							router.push(pathname + '?' + params.toString(), {
								scroll: false,
							});
						}}
						iconLeft={<Reply />}
					>
						Reply
					</Button>

					{user?.id === comment.author.id && (
						<CommentDelete commentId={comment.id} />
					)}
				</div>
			</div>

			{comment._count.postCommentsReplies > 0 && (
				<div className="mt-4">
					<Collapsible
						trigger={
							<div className="group">
								<Tag
									className="flex cursor-pointer items-center gap-4"
									suppressHydrationWarning
								>
									See {comment._count.postCommentsReplies}
									{comment._count.postCommentsReplies === 1
										? ' reply'
										: ' replies'}
									<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
								</Tag>
							</div>
						}
						contentProps={{
							children: (
								<RepliesMapping
									commentId={comment.id}
									repliesCount={comment._count.postCommentsReplies}
								/>
							),
						}}
					/>
				</div>
			)}
		</div>
	);
};

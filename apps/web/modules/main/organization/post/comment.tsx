'use client';

// External packages
import * as React from 'react';
import { ChevronRight } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Tag } from '@/components/ui/tag';
import { Collapsible } from '@/components/ui/collapsible';

// Modules
import { RepliesMapping } from '@/modules/main/organization/post/replies-mapping';
import { CommentLike } from '@/modules/main/organization/post/comment-like';

// Lib
import { formatTime } from '@/lib/utils/time-adjustments';
import { convertToFullname } from '@/lib/utils/converter';

// Types
import { PostCommentsResponse } from '@repo/types/comment';

export const Comment: React.FC<{
	comment: PostCommentsResponse['comments'][0];
	hasUserLiked: boolean;
}> = ({ comment, hasUserLiked }) => {
	return (
		<div className="border-b-input-border border-b py-4">
			<div className="flex items-center gap-4">
				<Avatar
					imageProps={{
						src: comment.author.image
							? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${comment.author.image}`
							: undefined,
					}}
					isVerified={comment.author.subscriptionTier === 'PRO'}
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

				<CommentLike comment={comment} hasUserLiked={hasUserLiked} />
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

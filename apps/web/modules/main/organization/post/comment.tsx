'use client';

// External packages
import * as React from 'react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Lib
import { formatTime } from '@/lib/utils/time-adjustments';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

import { ChevronRight, Heart, Reply, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PostCommentsResponse } from '@repo/types/comment';
import { useDeleteComment } from '@/hooks/data/comment';
import { Tag } from '@/components/ui/tag';
import { Collapsible } from '@/components/ui/collapsible';
import { RepliesMapping } from '@/modules/main/organization/post/replies-mapping';

export const Comment: React.FC<{
	comment: PostCommentsResponse['comments'][0];
}> = ({ comment }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const { mutate: mutateDeleteComment, isPending: isDeletingComment } =
		useDeleteComment(comment.id);
	return (
		<div className="border-b-input-border border-b py-4">
			<div className="flex items-center gap-4">
				<Avatar
					imageProps={{
						src: '',
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
						<p>{comment._count.postCommentsLikes}</p>
						<Button variant="blank" className="p-0">
							<Heart
								//  fill="#f59f0a" className="text-primary"
								className="text-background-foreground cursor-pointer"
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
							} else {
								params.set('commentId', comment.id);
							}

							router.push(pathname + '?' + params.toString(), {
								scroll: false,
							});
						}}
						iconLeft={<Reply />}
					>
						Reply
					</Button>

					<Button
						variant="blank"
						className="text-muted-foreground hover:text-destructive p-0"
						onPress={() => {
							mutateDeleteComment();
						}}
						isLoading={isDeletingComment}
					>
						<Trash2 />
					</Button>
				</div>
			</div>

			{comment._count.postCommentsReplies > 0 && (
				<div className="mt-4">
					<Collapsible
						trigger={
							<div className="group">
								<Tag className="flex cursor-pointer items-center gap-4">
									See {comment._count.postCommentsReplies}
									{comment._count.postCommentsReplies === 1
										? ' reply'
										: ' replies'}
									<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
								</Tag>
							</div>
						}
						contentProps={{
							children: <RepliesMapping commentId={comment.id} />,
						}}
					/>
				</div>
			)}
		</div>
	);
};

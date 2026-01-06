'use client';

// External packages
import * as React from 'react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Lib
import { formatTime } from '@/lib/utils/time-adjustments';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

import { Trash2 } from 'lucide-react';

import { useRetrieveCommentReplies } from '@/hooks/data/comment';
import { CommentOrReplySkeleton } from '@/modules/main/organization/post/comments-mapping';

export const RepliesMapping: React.FC<{
	commentId: string;
}> = ({ commentId }) => {
	const { data, isLoading } = useRetrieveCommentReplies(commentId);
	console.log('Replies data:', isLoading);
	return (
		<div className="mt-6">
			{data &&
				data.replies.length > 0 &&
				data?.replies.map((reply) => (
					<div className="ml-8 flex items-center gap-4" key={reply.id}>
						<div className="bg-muted-foreground h-full min-h-16 w-px" />
						<div className="flex flex-1 items-center gap-4">
							<Avatar
								imageProps={{
									src: '',
								}}
								colorScheme="gray"
							>
								{convertToFullname({
									firstname: reply.author.firstName || '',
									lastname: reply.author.lastName || '',
								})}
							</Avatar>

							<div>
								<p className="text-muted-foreground text-xs">
									{convertToFullname({
										firstname: reply.author.firstName || '',
										lastname: reply.author.lastName || '',
									})}{' '}
									| {formatTime(new Date(reply.createdAt))}
								</p>
								<p>{reply.content}</p>
							</div>

							<Button
								variant="blank"
								className="text-muted-foreground hover:text-destructive ml-auto self-end p-0 text-sm"
							>
								<Trash2 />
							</Button>
						</div>
					</div>
				))}

			{isLoading &&
				[...Array(8)].map((_, indx) => <CommentOrReplySkeleton key={indx} />)}
		</div>
	);
};

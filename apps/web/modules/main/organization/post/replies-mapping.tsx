'use client';

// External packages
import * as React from 'react';

// Hooks
import { useRetrieveCommentReplies } from '@/hooks/data/comment';

// Modules
import { CommentOrReplySkeleton } from '@/modules/main/organization/post/comments-mapping';
import { Reply } from '@/modules/main/organization/post/reply';

export const RepliesMapping: React.FC<{
	commentId: string;
	repliesCount: number;
}> = ({ commentId, repliesCount }) => {
	const { data, isLoading } = useRetrieveCommentReplies(commentId);
	return (
		<div className="mt-6">
			{data &&
				data.replies.length > 0 &&
				data?.replies.map((reply) => <Reply key={reply.id} reply={reply} />)}

			{isLoading &&
				[...Array(repliesCount > 10 ? 10 : repliesCount)].map((_, indx) => (
					<CommentOrReplySkeleton key={indx} />
				))}
		</div>
	);
};

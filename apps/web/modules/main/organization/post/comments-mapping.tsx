'use client';

// External packages
import * as React from 'react';

// Modules
import { Comment } from '@/modules/main/organization/post/comment';
import { useRetrievePostComments } from '@/hooks/data/comment';
import { useParams } from 'next/navigation';
import { PostCommentsResponse } from '@repo/types/comment';

export const CommentsMapping: React.FC<{
	comments: PostCommentsResponse;
}> = ({ comments }) => {
	const params = useParams<{ postId: string }>();
	const { data } = useRetrievePostComments(params.postId, {
		initialData: comments,
	});

	console.log(data);

	return data.comments.map((comment, indx) => (
		<div
			key={comment.id}
			className="no-scrollbar mt-4 max-h-[600px] overflow-scroll"
		>
			<Comment comment={comment} />
		</div>
	));
};

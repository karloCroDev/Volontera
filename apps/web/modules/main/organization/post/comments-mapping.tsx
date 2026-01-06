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
	const { data, isLoading } = useRetrievePostComments(params.postId, {
		initialData: comments,
	});

	// Kada budem implementirao infinite loading, paa za svaki slucaj
	if (isLoading) {
		return [...Array(8)].map((_, index) => (
			<CommentOrReplySkeleton key={index} />
		));
	}
	return data?.comments.map((comment) => (
		<div
			key={comment.id}
			className="no-scrollbar mt-4 max-h-[600px] overflow-scroll"
		>
			<Comment comment={comment} />
		</div>
	));
};

export const CommentOrReplySkeleton = () => (
	<div className="ml-8 flex items-center gap-4">
		<div className="bg-muted-foreground min-h-16 w-px animate-pulse" />

		<div className="flex flex-1 items-center gap-4">
			<div className="bg-muted-foreground h-10 w-10 animate-pulse rounded-full" />

			<div className="flex flex-1 flex-col gap-2">
				<div className="bg-muted-foreground h-4 w-full max-w-md animate-pulse rounded" />
				<div className="bg-muted-foreground h-4 w-3/4 animate-pulse rounded" />
			</div>

			<div className="bg-muted ml-auto h-4 w-4 animate-pulse rounded" />
		</div>
	</div>
);

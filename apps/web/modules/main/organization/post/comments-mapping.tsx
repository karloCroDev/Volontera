'use client';

// External packages
import * as React from 'react';
import { useParams } from 'next/navigation';

// Modules
import { Comment } from '@/modules/main/organization/post/comment';

// Hooks
import { useRetrievePostComments } from '@/hooks/data/comment';
import { useSession } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const CommentsMapping = withReactQueryProvider(() => {
	const params = useParams<{ postId: string }>();
	const { data, isLoading } = useRetrievePostComments(params.postId);

	const { data: user } = useSession();

	// Kada budem implementirao infinite loading, paa za svaki slucaj
	if (isLoading) {
		return [...Array(4)].map((_, index) => (
			<CommentOrReplySkeleton key={index} />
		));
	}

	return data && data.comments.length > 0 ? (
		data.comments.map((comment) => (
			<div
				key={comment.id}
				className="no-scrollbar mt-4 max-h-[600px] overflow-scroll"
			>
				<Comment
					comment={comment}
					hasUserLiked={comment.postCommentsLikes.some(
						(like) => like.userId === user?.id
					)}
				/>
			</div>
		))
	) : (
		<p className="text-muted-foreground mt-4 text-center text-sm">
			No comments yet. Be the first to comment!
		</p>
	);
});

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

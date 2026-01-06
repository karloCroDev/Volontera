'use client';

// External packages
import * as React from 'react';

// Hooks
import { useRetrieveCommentReplies } from '@/hooks/data/comment';

// Modules
import { CommentOrReplySkeleton } from '@/modules/main/organization/post/comments-mapping';
import { Reply } from '@/modules/main/organization/post/reply';
import { useGetImageFromKeys } from '@/hooks/data/image';

export const RepliesMapping: React.FC<{
	commentId: string;
	repliesCount: number;
}> = ({ commentId, repliesCount }) => {
	// Ova sekcija je samo fetchana kada se collapsible otvori, zato ovaj dio isključivo fetcham na client umjesto servera. Također, replyjeva nije puno, pa nije problem da ne mijenjam cache već da isključivo fetcham podatke za te replyjeve, zbog toga ovdje nije implemtirani optimistic updateovi.
	const { data, isLoading } = useRetrieveCommentReplies(commentId);
	const { data: pfpImages } = useGetImageFromKeys({
		imageUrls:
			data?.replies
				.map((reply) => reply.author.image)
				.filter((key) => key !== null && key !== undefined) || [],
	});
	return (
		<div className="mt-6">
			{data &&
				data.replies.length > 0 &&
				data?.replies.map((reply) => (
					<Reply key={reply.id} reply={reply} pfpImages={pfpImages?.urls} />
				))}

			{isLoading &&
				[...Array(repliesCount > 10 ? 10 : repliesCount)].map((_, indx) => (
					<CommentOrReplySkeleton key={indx} />
				))}
		</div>
	);
};

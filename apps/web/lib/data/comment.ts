// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	CreateReplyArgs,
	CreateCommentArgs,
	DeleteCommentArgs,
	DeleteReplyArgs,
	LikeOrDislikeCommentArgs,
	LikeOrDislikeReplyArgs,
	RetrieveCommentRepliesArgs,
	RetrievePostCommentsArgs,
} from '@repo/schemas/comment';

export async function retrievePostCommentsSchema({
	postId,
}: RetrievePostCommentsArgs) {
	try {
		const res = await API().get(`/comment${postId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createComment({ data }: { data: CreateCommentArgs }) {
	try {
		const res = await API().post('/comment', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteComment({ commentId }: DeleteCommentArgs) {
	try {
		const res = await API().delete(`/comment${commentId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function toggleLikeComment({
	commentId,
}: LikeOrDislikeCommentArgs) {
	try {
		const res = await API().patch(`/comment/${commentId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveCommentReplies({
	commentId,
}: RetrieveCommentRepliesArgs) {
	try {
		const res = await API().get(`/comment/reply/${commentId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createReply(data: CreateReplyArgs) {
	try {
		const res = await API().post('/comment/reply', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteReply({ replyId }: DeleteReplyArgs) {
	try {
		const res = await API().delete(`/comment/reply/${replyId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function toggleLikeReply({ replyId }: LikeOrDislikeReplyArgs) {
	try {
		const res = await API().patch(`/comment/reply/${replyId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

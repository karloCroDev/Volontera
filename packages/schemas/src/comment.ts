// External packages
import { z } from "zod";

// Comments
export const createCommentSchema = z.object({
  postId: z.cuid(),
  userId: z.cuid(),
  content: z.string().min(1).max(100),
});
export type CreateCommentArgs = z.infer<typeof createCommentSchema>;

export const deleteCommentSchema = z.object({
  commentId: z.cuid(),
});
export type DeleteCommentArgs = z.infer<typeof deleteCommentSchema>;

export const likeOrDislikeCommentSchema = z.object({
  commentId: z.cuid(),
  userId: z.cuid(),
});
export type LikeOrDislikeCommentArgs = z.infer<
  typeof likeOrDislikeCommentSchema
>;

// Replies
export const retrieveCommentRepliesSchema = z.object({
  commentId: z.cuid(),
});
export type RetrieveCommentRepliesArgs = z.infer<
  typeof retrieveCommentRepliesSchema
>;

export const createReplySchema = z.object({
  commentId: z.cuid(),
  userId: z.cuid(),
  content: z.string().min(1).max(100),
});
export type CreateReplyArgs = z.infer<typeof createReplySchema>;

export const deleteReplySchema = z.object({
  replyId: z.cuid(),
});
export type DeleteReplyArgs = z.infer<typeof deleteReplySchema>;

export const likeOrDislikeReplySchema = z.object({
  replyId: z.cuid(),
  userId: z.cuid(),
});
export type LikeOrDislikeReplyArgs = z.infer<typeof likeOrDislikeReplySchema>;

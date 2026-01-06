import { PostComments, User, PostCommentsReply } from "@repo/database";
import { SuccessfulResponse } from "general";

export type PostCommentsResponse = SuccessfulResponse & {
  comments: (PostComments & {
    author: User;
  })[];
};
export type PostCommentRepliesResponse = SuccessfulResponse & {
  replies: (PostCommentsReply & {
    author: User;
  })[];
};

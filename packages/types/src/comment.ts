import {
  PostComments,
  User,
  PostCommentsReply,
  PostLikes,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type PostCommentsResponse = ServerHandleResponse<true> & {
  comments: (PostComments & {
    author: User;
    postLikes: PostLikes[];
  })[];
};

export type PostCommentRepliesResponse = ServerHandleResponse<true> & {
  replies: (PostCommentsReply & {
    author: User;
    postLikes: PostLikes[];
  })[];
};

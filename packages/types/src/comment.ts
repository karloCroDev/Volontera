import {
  PostComments,
  User,
  PostCommentsReply,
  PostCommentsLikes,
  PostCommentsReplyLikes,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type PostCommentsResponse = ServerHandleResponse<true> & {
  comments: (PostComments & {
    author: User;
    postCommentsLikes: PostCommentsLikes[];
    _count: {
      postCommentsLikes: number;
      postCommentsReplies: number;
    };
  })[];
};

export type PostCommentRepliesResponse = ServerHandleResponse<true> & {
  replies: (PostCommentsReply & {
    author: User;
    postCommentsReplyLikes: PostCommentsReplyLikes[];
  })[];
};

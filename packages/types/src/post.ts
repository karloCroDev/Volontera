// Database
import {
  Post,
  PostComments,
  PostImages,
  Organization,
  User,
  PostLikes,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

type SharedPostValues = Post & {
  organization: Organization;
  postImages: PostImages[];
  author: User;
  postLikes: PostLikes[];
  _count: {
    postComments: number;
    postLikes: number;
  };
};

export type RetrieveOrganizationPostsResponse = ServerHandleResponse<true> & {
  posts: SharedPostValues[];
};

export type RetrievePostWithComments = ServerHandleResponse<true> & {
  post: Post &
    SharedPostValues & {
      postComments: (PostComments & {
        postLikes: PostLikes[];
        author: User;
      })[];
    };
};

export type RetrievePostData = ServerHandleResponse<true> & {
  post: Post & {
    postImages: PostImages[];
  };
};

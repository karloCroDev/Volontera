// Database
import {
  Post,
  PostComments,
  PostImages,
  Organization,
  User,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

type SharedPostValues = Post & {
  organization: Organization;
  postImages: PostImages[];
  author: User;
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
      postComments: PostComments[];
    };
};

export type RetrievePostData = SuccessfulResponse & {
  post: Post & {
    postImages: PostImages[];
  };
};

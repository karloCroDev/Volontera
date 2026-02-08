// Database
import { Post, PostImages, User, PostLikes } from "@repo/database";

import { ServerHandleResponse } from "./general";
import { PostCommentsResponse } from "./comment";
import { OrganizationWithOwner } from "./organization";

type SharedPostValues = Post & {
  organization: OrganizationWithOwner & {
    _count: {
      organizationFollowers: number;
      organizationMembers: number;
    };
  };
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
      postComments: PostCommentsResponse["comments"];
    };
};

export type RetrievePostData = ServerHandleResponse<true> & {
  post: Post & {
    postImages: PostImages[];
  };
};

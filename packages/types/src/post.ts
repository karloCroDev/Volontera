import { Post, PostComments, PostImages } from "@repo/database";

export type RetrieveOrganizationPostsResponse = (Post & {
  postImages: PostImages[];
})[];

export type RetrievePostWithComments = Post & {
  postImages: PostImages[];
  postComments: PostComments[];
};

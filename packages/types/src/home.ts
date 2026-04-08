import { ServerHandleResponse } from "./general";
import { RetrieveOrganizationPostsResponse } from "./post";

export type RetrieveHomePostsResponse = ServerHandleResponse<true> & {
  posts: RetrieveOrganizationPostsResponse["posts"];
  nextCursor: string | null;
};

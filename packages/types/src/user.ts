import type { ServerHandleResponse } from "./general";
import type { Organization, User as PrismaUser } from "@repo/database";
import { RetrieveOrganizationPostsResponse } from "./post";

// Session (User)
export type UserResponse = Omit<PrismaUser, "password"> &
  ServerHandleResponse<true>;

export type RetrievePostsUserResponse = RetrieveOrganizationPostsResponse;

export type RetrieveOrganizationUserResponse = ServerHandleResponse<true> & {
  organizations: Organization[];
};

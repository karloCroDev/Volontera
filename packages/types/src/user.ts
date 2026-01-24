import type { ServerHandleResponse } from "./general";
import type { User as PrismaUser } from "@repo/database";
import { RetrieveOrganizationPostsResponse } from "./post";
import type { OrganizationWithOwner } from "./organization";

// Session (User)
export type UserResponse = Omit<PrismaUser, "password"> &
  ServerHandleResponse<true>;

export type RetrievePostsUserResponse = RetrieveOrganizationPostsResponse;

export type RetrieveOrganizationUserResponse = ServerHandleResponse<true> & {
  organizations: OrganizationWithOwner[];
};

import {
  OrganizationJoinRequest,
  OrganizationMember,
  User,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveAllMembersInOrganizationResponse =
  ServerHandleResponse<true> & {
    requests: ({
      user: Omit<User, "password">;
    } & OrganizationMember)[];
  };

export type RetirveAllRequestsToJoinOrganizationResponse =
  ServerHandleResponse<true> & {
    requests: ({
      requester: Omit<User, "password">;
    } & OrganizationJoinRequest)[];
  };

export type RetrieveOrganizationMemberResponse = ServerHandleResponse<true> & {
  organizationMember: OrganizationMember;
};

import {
  OrganizationJoinRequest,
  OrganizationMember,
  User,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveAllUsersInOrganizationResponse =
  ServerHandleResponse<true> & {
    requests: ({
      requseter: Omit<User, "password">;
    } & OrganizationJoinRequest)[];
  };

export type RetirveAllRequestsToJoinOrganizationResponse =
  ServerHandleResponse<true> & {
    requests: ({
      user: Omit<User, "password">;
    } & OrganizationJoinRequest)[];
  };

export type RetrieveOrganizationMemberResponse = ServerHandleResponse<true> & {
  organizationMember: OrganizationMember;
};

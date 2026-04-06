import {
  OrganizationLeaveFeedback,
  OrganizationJoinRequest,
  OrganizationMember,
  User,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type RetrieveAllMembersInOrganizationResponse =
  ServerHandleResponse<true> & {
    members: ({
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
  organizationMember: OrganizationMember & {
    user: Omit<User, "password">;
  };
};

export type RetrieveDataAboutOrganizationResponse =
  ServerHandleResponse<true> & {
    adminUserCount: number;
    memberUserCount: number;
    totalUserCount: number;
    highPriority: number;
    lowPriority: number;
    mediumPriority: number;
  };

export type RetrieveAllOrganizationLeaveFeedbacksResponse =
  ServerHandleResponse<true> & {
    leaveFeedbacks: (OrganizationLeaveFeedback & {
      author: Omit<User, "password">;
    })[];
  };

export type UpdateOrganizationResponse = SuccessfulResponse & {
  imageAvatar?: string;
  imageCover?: string;
};

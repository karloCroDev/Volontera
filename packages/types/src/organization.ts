// Database
import {
  OrganizationMember,
  OrganizationInfo,
  Organization,
  OrganizationFollowers,
  AdditionalLinks,
  User,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type CreateOrganizationResponse = SuccessfulResponse & {
  organizationId: Organization["id"];
};

export type GetOrganizationDetailsByIdResponse = ServerHandleResponse<true> & {
  organization: Organization & {
    organizationInfo: OrganizationInfo & {
      additionalLinks: AdditionalLinks[];
    };
    _count: {
      organizationFollowers: number;
      organizationMembers: number;
    };
  };
  membersHierarchy: {
    admins: (OrganizationMember & {
      user: Omit<User, "password">;
    })[];
    members: (OrganizationMember & {
      user: Omit<User, "password">;
    })[];
  };
  isFollowing: boolean;
};

export type ListOrganizationsOrganizatorResponse = SuccessfulResponse & {
  ownedOrganizations: Organization[];
  followingOrganizations: Organization[];
  attendingOrganizations: Organization[];
};

export type ListOrganizationsUserResponse = SuccessfulResponse & {
  followingOrganizations: Organization[];
  attendingOrganizations: Organization[];
};

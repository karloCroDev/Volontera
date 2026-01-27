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
    owner: Omit<User, "password">;
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

export type OrganizationWithOwner = Organization & {
  owner: Omit<User, "password">;
};

export type ListOrganizationsOrganizatorResponse = SuccessfulResponse & {
  ownedOrganizations: OrganizationWithOwner[];
  followingOrganizations: OrganizationWithOwner[];
  attendingOrganizations: OrganizationWithOwner[];
};

export type ListOrganizationsUserResponse = SuccessfulResponse & {
  followingOrganizations: OrganizationWithOwner[];
  attendingOrganizations: OrganizationWithOwner[];
};

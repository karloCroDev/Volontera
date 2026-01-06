// Database
import {
  OrganizationAttendees,
  OrganizationInfo,
  Organization,
  OrganizationFollowers,
  AdditionalLinks,
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
    organizationFollowers: OrganizationFollowers[];
    organizationAttendees: OrganizationAttendees[];
  };
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

// Database
import {
  OrganizationAttendees,
  OrganizationInfo,
  Orgnizations,
  OrganizationFollowers,
  AdditionalLinks,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type CreateOrganizationResponse = SuccessfulResponse & {
  organizationId: Orgnizations["id"];
};

export type GetOrganizationDetailsByIdResponse = ServerHandleResponse<true> & {
  organization: Orgnizations & {
    organizationInfo: OrganizationInfo & {
      additionalLinks: AdditionalLinks[];
    };
    organizationFollowers: OrganizationFollowers[];
    organizationAttendees: OrganizationAttendees[];
  };
};

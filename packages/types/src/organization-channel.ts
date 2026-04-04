import { ServerHandleResponse } from "./general";

// Database
import { OrganizationChannels } from "@repo/database";

export type RetrieveOrganizationChannelsResponse =
  ServerHandleResponse<true> & {
    organizationChannels: OrganizationChannels[];
  };

import { ServerHandleResponse } from "./general";

// Database
import { OrganizationChannelChat, OrganizationGroupChat } from "@repo/database";

export type RetrieveOrganizationChannelsResponse =
  ServerHandleResponse<true> & {
    organizationGroupChat: OrganizationGroupChat & {
      channelChat: OrganizationChannelChat[];
    };
  };

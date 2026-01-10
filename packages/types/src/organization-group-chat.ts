import {
  OrganizationGroupChatMessage,
  OrganizationGroupChatMessageImage,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveAllOrganizationGroupChatMessagesResponse =
  ServerHandleResponse<true> & {
    messages: OrganizationGroupChatMessage &
      {
        organizationGroupChatMessageImages: OrganizationGroupChatMessageImage[];
      }[];
  };

import {
  OrganizationGroupChat,
  OrganizationGroupChatMessage,
  OrganizationGroupChatMessageImage,
  User,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveAllOrganizationGroupChatMessagesResponse =
  ServerHandleResponse<true> & {
    organizationGroupChat: OrganizationGroupChat & {
      messages: (OrganizationGroupChatMessage & {
        organizationGroupChatMessageImages: OrganizationGroupChatMessageImage[];
        author: Omit<User, "password">;
      })[];
    };
  };

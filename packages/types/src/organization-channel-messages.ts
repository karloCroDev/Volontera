import { ServerHandleResponse } from "./general";

// Database
import {
  OrganizationChannelChat,
  OrganizationChannelChatMessage,
  OrganizationChannelChatMessageImage,
  OrganizationGroupChat,
  User,
} from "@repo/database";

export type OrganizationChannelMessage = Omit<
  OrganizationChannelChatMessage,
  "channelChatId" | "organizationChannelChatMessageImages"
> & {
  groupChatId: OrganizationGroupChat["id"];
  organizationGroupChatMessageImages: OrganizationChannelChatMessageImage[];
  parentMessage:
    | (Pick<OrganizationChannelChatMessage, "id" | "content"> & {
        author: Omit<User, "password">;
      })
    | null;
  author: Omit<User, "password">;
};

export type RetrieveAllOrganizationChannelMessagesResponse =
  ServerHandleResponse<true> & {
    organizationGroupChat: OrganizationGroupChat & {
      channelChat: (OrganizationChannelChat & {
        messages: OrganizationChannelMessage[];
      })[];
      messages: OrganizationChannelMessage[];
    };
  };

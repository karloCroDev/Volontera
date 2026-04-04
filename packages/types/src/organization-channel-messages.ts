import { ServerHandleResponse } from "./general";

// Database
import {
  OrganizationChannels,
  OrganizationChannelChatMessage,
  OrganizationChannelChatMessageImage,
  User,
} from "@repo/database";

export type OrganizationChannelMessage = Omit<
  OrganizationChannelChatMessage,
  "channelChatId" | "organizationChannelChatMessageImages"
> & {
  groupChatId: OrganizationChannels["id"];
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
    organizationChannel: OrganizationChannels & {
      messages: OrganizationChannelMessage[];
    };
  };

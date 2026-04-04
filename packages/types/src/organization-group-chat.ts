import {
  OrganizationChannelChat,
  OrganizationChannelChatMessage,
  OrganizationChannelChatMessageImage,
  OrganizationGroupChat,
  User,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type OrganizationGroupChatMessage = Omit<
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

export type RetrieveAllOrganizationGroupChatMessagesResponse =
  ServerHandleResponse<true> & {
    organizationGroupChat: OrganizationGroupChat & {
      channelChat: (OrganizationChannelChat & {
        messages: OrganizationGroupChatMessage[];
      })[];
      messages: OrganizationGroupChatMessage[];
    };
  };

export type RetrieveOrganizationGroupChatChannelsResponse =
  ServerHandleResponse<true> & {
    organizationGroupChat: OrganizationGroupChat & {
      channelChat: (OrganizationChannelChat & {
        messages: OrganizationGroupChatMessage[];
      })[];
    };
  };

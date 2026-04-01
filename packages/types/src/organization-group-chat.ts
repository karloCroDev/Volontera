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
        parentMessage:
          | (Pick<OrganizationGroupChatMessage, "id" | "content"> & {
              author: Omit<User, "password">;
            })
          | null;
        author: Omit<User, "password">;
      })[];
    };
  };

import {
  DirectMessages,
  DirectMessagesConversations,
  User,
} from "@repo/database";
import { ServerHandleResponse, SuccessfulResponse } from "./general";

// Both for listing conversations and searching all conversations
export type ListConversationsResponse = ServerHandleResponse<true> & {
  conversations: (DirectMessagesConversations & {
    participant: Omit<User, "password">;
  })[];
};

export type SearchUsersResponse = SuccessfulResponse & {
  users: Omit<User, "password">[];
};

export type StartConversationOrStartAndSendDirectMessageResonse =
  SuccessfulResponse & {
    conversationId: DirectMessagesConversations["id"];
  };

export type GetDirectMessagesConversationByIdResponse = SuccessfulResponse & {
  conversation: (DirectMessages & {
    author: Omit<User, "password">;
    directMessagesImages: DirectMessagesConversations;
  })[];
};

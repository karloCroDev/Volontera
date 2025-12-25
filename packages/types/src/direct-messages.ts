import { DirectMessagesConversations, User } from "@repo/database";
import { ServerHandleResponse } from "./general";

// Both for listing conversations and searching all conversations
export type ListConversationsResponse = ServerHandleResponse<true> & {
  conversations: (DirectMessagesConversations & {
    participant: Omit<User, "password">;
  })[];
};

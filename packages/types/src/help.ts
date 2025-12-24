import { ServerHandleResponse, SuccessfulResponse } from "./general";
import { Help } from "@repo/database";

export type HelpConversationSuccess = {
  messages: Help[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

export type RetrieveAIResponse = SuccessfulResponse & {
  llmResponse: string;
};

import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type HelpConversationSuccess = {
  messages: {
    id: string;
    userId: string;
    senderType: "USER" | "AI";
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

export type RetrieveAIResponse = SuccessfulResponse & {
  llmResponse: string;
};

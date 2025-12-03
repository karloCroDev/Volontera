import { SuccessfulResponse } from "./general";

export type HelpConversationSuccess = {
  messages: {
    id: string;
    createdAt: Date;
    userId: string;
    senderType: "USER" | "AI";
    content: string;
  }[];
} & SuccessfulResponse;

export type RetrieveAIResponse = SuccessfulResponse & {
  llmResponse: string;
};

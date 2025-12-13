import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type NotificationResponse = {
  id: string;
  userId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}[] &
  SuccessfulResponse &
  ServerHandleResponse<true>;

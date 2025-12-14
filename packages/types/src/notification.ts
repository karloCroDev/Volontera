import { ServerHandleResponse, SuccessfulResponse } from "./general";
import { User } from "./auth";

export type NotificationResponse = {
  notifications: {
    id: string;
    userId: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  }[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

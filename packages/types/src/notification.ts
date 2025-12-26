import { ServerHandleResponse, SuccessfulResponse } from "./general";
import { Notification, User } from "@repo/database";

export type NotificationResponse = {
  notifications: (Notification & {
    user: Omit<User, "password">;
  })[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

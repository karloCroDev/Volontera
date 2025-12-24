import { ServerHandleResponse, SuccessfulResponse } from "./general";
import { User } from "./auth";
import { Notification } from "@repo/database";

export type NotificationResponse = {
  notifications: (Notification & {
    user: User;
  })[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

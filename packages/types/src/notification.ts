import { ServerHandleResponse, SuccessfulResponse } from "./general";
import { Notification } from "@repo/database";

export type NotificationResponse = {
  notifications: Notification[];
} & SuccessfulResponse &
  ServerHandleResponse<true>;

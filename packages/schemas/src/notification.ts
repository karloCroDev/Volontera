// External pakcages
import { z } from "zod";

export const notificationIdsSchema = z.object({
  notificationIds: z.array(z.cuid()),
});
export type NotificationIdsArgs = z.infer<typeof notificationIdsSchema>;

export const createNotificationSchema = z.object({
  content: z.string().min(1).max(500),
});
export type CreateNotificationArgs = z.infer<typeof createNotificationSchema>;

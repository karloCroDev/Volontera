import { z } from "zod";

export const oneNotificationIdSchema = z.object({
  notificationId: z.cuid(),
});
export type OneNotificationIdArgs = z.infer<typeof oneNotificationIdSchema>;

export const notificationIdsSchema = z.object({
  notificationIds: z.array(oneNotificationIdSchema.shape.notificationId),
});
export type NotificationIdsArgs = z.infer<typeof notificationIdsSchema>;

export const markNotificationAsReadSchema = oneNotificationIdSchema.extend({
  isRead: z.boolean(),
});
export type MarkNotificationAsReadArgs = z.infer<
  typeof markNotificationAsReadSchema
>;

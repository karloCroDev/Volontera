// External packages
import { Notification, User } from "@prisma/client";

export async function retrieveUserNotificationsService({}: {
  userId: User["id"];
}) {}

export async function createNotificationService({}: {
  userId: User["id"];
  notificationId: Notification["id"];
}) {}

export async function deleteNotificationsService() {}

export async function deleteOneNotificationService() {}

export async function markNotificationAsReadService() {}

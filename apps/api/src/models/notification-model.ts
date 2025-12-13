// External packages
import { User, Notification } from "@prisma/client";

// Config
import { prisma } from "@/config/prisma";

export async function retrieveUserNotifications({
  userId,
}: {
  userId: User["id"];
}) {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createNotification({
  userId,
  content,
}: {
  userId: User["id"];
  content: Notification["content"];
}) {
  return await prisma.notification.create({
    data: {
      userId,
      content,
    },
  });
}

export async function deleteNotifications({
  notificationsIds,
}: {
  notificationsIds: Notification["id"][];
}) {
  return await prisma.notification.deleteMany({
    where: {
      id: { in: notificationsIds },
    },
  });
}

export async function deleteOneNotification({
  notificationId,
}: {
  userId: User["id"];
  notificationId: Notification["id"];
}) {
  return await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
}

export async function markNotificationAsRead({
  notificationIds,
}: {
  notificationIds: Notification["id"][];
}) {
  return await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
    },
    data: {
      isRead: true,
    },
  });
}

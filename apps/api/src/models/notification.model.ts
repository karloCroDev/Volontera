// Database
import { prisma, User, Notification } from "@repo/database";

export async function retrieveUserNotifications(userId: User["id"]) {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
}

export async function hasUnreadNotifications({
  userId,
}: {
  userId: User["id"];
}) {
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
  return count;
}

export async function deleteNotifications({
  notificationIds,
}: {
  notificationIds: Notification["id"][];
}) {
  return await prisma.notification.deleteMany({
    where: {
      id: { in: notificationIds },
    },
  });
}

export async function deleteOneNotification({
  notificationId,
}: {
  notificationId: Notification["id"];
}) {
  return await prisma.notification.delete({
    where: {
      id: notificationId,
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

export async function markNotificationAsRead(userId: User["id"]) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

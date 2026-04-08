// Database
import { prisma, User, Notification } from "@repo/database";
import { subHours } from "date-fns";

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
      sender: {
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

export async function retrieveAllUnreadNotificationsFromUsers({
  timeInterval = 24,
}: {
  timeInterval?: number;
}) {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      notifications: {
        where: {
          isRead: false,
          createdAt: {
            gte: subHours(new Date(), timeInterval),
          },
        },
        select: {
          id: true,
        },
      },
    },
  });
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

// Creating notifications
type NotificationCreationArgs = {
  userId: User["id"];
  senderId: User["id"];
  content: Notification["content"];
};

export async function createNotification(data: NotificationCreationArgs) {
  return await prisma.notification.create({
    data,
  });
}

export async function createMultipleNotifications(
  data: NotificationCreationArgs[],
) {
  return await prisma.notification.createMany({
    data,
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

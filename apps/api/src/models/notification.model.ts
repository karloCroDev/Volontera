// External packages
import { createElement } from "react";

// Database
import { prisma, User, Notification as DbNotification } from "@repo/database";

// Models
import { findUserById } from "@/models/user.model";

// Config
import { resend } from "@/lib/config/resend";

// Transactional emails
import { Notification as NotificationEmail } from "@repo/transactional/notification";

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
  notificationIds: DbNotification["id"][];
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
  notificationId: DbNotification["id"];
}) {
  return await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
}

type NotificationCreationArgs = {
  userId: User["id"];
  content: DbNotification["content"];
};

export async function createNotification({
  userId,
  content,
}: NotificationCreationArgs) {
  const unreadCountBefore = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  const notification = await prisma.notification.create({
    data: {
      userId,
      content,
    },
  });

  const unreadCountAfter = unreadCountBefore + 1;

  if (unreadCountAfter > 0 && unreadCountAfter % 6 === 0) {
    const user = await findUserById(userId);

    if (user) {
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: user.email,
        subject: "You have new notifications",
        react: createElement(NotificationEmail, {
          firstName: user.firstName,
          notificationsCount: unreadCountAfter,
        }),
      });
    }
  }

  return notification;
}

export async function createNotifications(data: NotificationCreationArgs[]) {
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

// External packages
import { createElement } from "react";

// Database
import { User } from "@repo/database";

// Models
import {
  createNotification,
  deleteOneNotification,
  retrieveUserNotifications,
  deleteNotifications,
  hasUnreadNotifications,
  markNotificationAsRead,
} from "@/models/notification.model";
import { findUserById } from "@/models/user.model";

// Schemas
import {
  CreateNotificationArgs,
  NotificationIdsArgs,
} from "@repo/schemas/notification";

// Config
import { resend } from "@/config/resend";

// Transactionl emails
import { Notification } from "@repo/transactional/notification";
import { toastResponseOutput } from "@/lib/utils/service-output";

export async function getUserNotificationsService(userId: User["id"]) {
  const notifications = await retrieveUserNotifications(userId);
  return {
    status: 200,
    body: {
      message: "User notifications retrieved successfully",
      success: true,
      notifications,
    },
  };
}

export async function hasUnreadNotificationsService(userId: User["id"]) {
  const unreadCount = await hasUnreadNotifications({ userId });

  // Na svaku treću nepročitanu notifikaciju pošalji email korisniku kao podsjetnik
  if (unreadCount > 0 && unreadCount % 3 === 0) {
    const user = await findUserById(userId);

    if (user) {
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: user.email,
        subject: "You have new notifications",
        react: createElement(Notification, {
          firstName: user.firstName,
          notificationsCount: unreadCount,
        }),
      });
    }
  }

  if (unreadCount > 0) {
    return {
      status: 200,
      body: {
        title: "Unread notifications status retrieved",
        message: "Unread notifications status retrieved successfully",
        hasUnread: !!unreadCount,
      },
    };
  }

  return {
    status: 200,
    body: {
      title: "Unread notifications status retrieved",
      message: "Unread notifications status retrieved successfully",
      hasUnread: !!unreadCount,
    },
  };
}

export async function markNotificationAsReadService(userId: User["id"]) {
  await markNotificationAsRead(userId);

  return {
    status: 200,
    body: {
      title: "Notifications marked as read",
      message: "All notifications have been marked as read",
    },
  };
}

export async function createNotificationService({
  data,
  userId,
}: {
  data: CreateNotificationArgs;
  userId: User["id"];
}) {
  await createNotification({
    userId,
    content: data.content,
  });

  return {
    status: 200,
    body: {
      title: "Notification created",
      message: "Notification created successfully",
    },
  };
}

export async function deleteNotificationsService({
  notificationIds,
}: NotificationIdsArgs) {
  if (notificationIds.length === 1) {
    await deleteOneNotification({ notificationId: notificationIds[0]! });
  } else {
    await deleteNotifications({
      notificationIds,
    });
  }

  return toastResponseOutput({
    status: 200,
    title: "Notifications deleted",
    message: "Notifications deleted successfully",
  });
}

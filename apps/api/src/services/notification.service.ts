// External packages
import { User } from "@prisma/client";
import { createElement } from "react";

// Models
import {
  createNotification,
  deleteOneNotification,
  retrieveUserNotifications,
  deleteNotifications,
  hasUnreadNotifications,
  markNotificationAsRead,
} from "@/models/notification-model";
import { findUserById } from "@/models/auth-model";

// Schemas
import {
  createNotificationSchema,
  notificationIdsSchema,
} from "@repo/schemas/notification";

// Config
import { resend } from "@/config/resend";

// Transactionl emails
import { Notification } from "@repo/transactional/notification";

export async function getUserNotificationsService(userId: User["id"]) {
  const notifications = await retrieveUserNotifications(userId);
  return {
    status: 200,
    body: {
      title: "Notifications retrieved",
      message: "User notifications retrieved successfully",
      success: true,
      notifications,
    },
  };
}

export async function hasUnreadNotificationsService(userId: User["id"]) {
  const unreadCount = await hasUnreadNotifications({ userId });

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

  if (unreadCount > 2) {
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
  rawData,
  userId,
}: {
  userId: User["id"];
  rawData: unknown;
}) {
  const { success, data } = createNotificationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot create notification",
        message: "Invalid data",
      },
    };
  }

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

export async function deleteNotificationsService(rawData: unknown) {
  console.log(rawData);
  const { success, data } = notificationIdsSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot delete notification",
        message: "Invalid data",
      },
    };
  }

  if (data.notificationIds.length === 1) {
    await deleteOneNotification({ notificationId: data.notificationIds[0]! });
  } else {
    await deleteNotifications({
      notificationsIds: data.notificationIds,
    });
  }

  return {
    status: 200,
    body: {
      title: "Notifications deleted",
      message: "Notifications deleted successfully",
    },
  };
}

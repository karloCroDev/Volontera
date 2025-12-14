// External packages
import { User, Notification } from "@prisma/client";

// Config
import { prisma } from "@/config/prisma";

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
        // TODO: Only data I am willing to expose (if it repeats multiple times, consider creating a select object)
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          bio: true,
          address: true,
          workOrSchool: true,
          pricingId: true,
          image: true,
          DOB: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          subscriptionTier: true,
          onboardingFinished: true,
          subscriptionType: true,
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

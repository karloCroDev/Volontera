// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createNotification,
  deleteNotifications,
  getUsersNotifications,
  hasUnreadNotifications,
  markAllNotificationsAsRead,
} from "@/controllers/notifications.controller";
import {
  notificationIdsSchema,
  createNotificationSchema,
} from "@repo/schemas/notification";
import { validate } from "@/middleware/validate.middleware";

export const notificationRoutes = Router();

notificationRoutes.use(express.json());

notificationRoutes
  .route("/")
  .get(getUsersNotifications)
  .post(
    validate({
      schema: createNotificationSchema,
      responseOutput: "toast",
    }),
    createNotification
  )
  .delete(
    validate({
      schema: notificationIdsSchema,
      responseOutput: "toast",
    }),
    deleteNotifications
  );

notificationRoutes.route("/unread").get(hasUnreadNotifications);
notificationRoutes.get("/read", markAllNotificationsAsRead);

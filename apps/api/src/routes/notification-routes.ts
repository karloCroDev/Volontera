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

export const notificationRoutes = Router();

notificationRoutes.use(express.json());

notificationRoutes
  .route("/")
  .get(getUsersNotifications)
  .post(createNotification)
  .delete(deleteNotifications);

notificationRoutes.route("/unread").get(hasUnreadNotifications);
notificationRoutes.get("/read", markAllNotificationsAsRead);

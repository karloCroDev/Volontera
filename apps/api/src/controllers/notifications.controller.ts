// External packages
import { Request, Response } from "express";

// Services
import {
  createNotificationService,
  deleteNotificationsService,
  getUserNotificationsService,
  hasUnreadNotificationsService,
  markNotificationAsReadService,
} from "@/services/notification.service";

export async function getUsersNotifications(req: Request, res: Response) {
  try {
    const result = await getUserNotificationsService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function hasUnreadNotifications(req: Request, res: Response) {
  try {
    const result = await hasUnreadNotificationsService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const result = await markNotificationAsReadService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function createNotification(req: Request, res: Response) {
  try {
    const result = await createNotificationService({
      rawData: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function deleteNotifications(req: Request, res: Response) {
  try {
    const result = await deleteNotificationsService({
      userId: req.user.userId,
      rawData: req.body,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

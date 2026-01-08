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
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function getUsersNotifications(req: Request, res: Response) {
  try {
    const result = await getUserNotificationsService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function hasUnreadNotifications(req: Request, res: Response) {
  try {
    const result = await hasUnreadNotificationsService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const result = await markNotificationAsReadService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createNotification(req: Request, res: Response) {
  try {
    const result = await createNotificationService({
      data: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteNotifications(req: Request, res: Response) {
  try {
    const result = await deleteNotificationsService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

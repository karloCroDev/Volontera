// External packages
import { Request, Response } from "express";

// Services
import {
  changeProfileInfoService,
  deleteAccountService,
  resetPasswordInAppService,
} from "@/services/settings.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function changeProfileInfo(req: Request, res: Response) {
  try {
    const result = await changeProfileInfoService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function resetPasswordInApp(req: Request, res: Response) {
  try {
    const result = await resetPasswordInAppService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const result = await deleteAccountService({
      userId: req.user.userId,
    });

    if (result.status === 200) {
      res.clearCookie("token");
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

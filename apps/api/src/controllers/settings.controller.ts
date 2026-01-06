// External packages
import { Request, Response } from "express";
import {
  changeProfileInfoService,
  deleteAccountService,
  resetPasswordInAppService,
} from "@/services/settings.service";

export async function changeProfileInfo(req: Request, res: Response) {
  try {
    const result = await changeProfileInfoService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function resetPasswordInApp(req: Request, res: Response) {
  try {
    const result = await resetPasswordInAppService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
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
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

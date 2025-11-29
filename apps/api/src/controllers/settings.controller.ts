// External packages
import { Request, Response } from "express";
import { changeProfileInfoService } from "@/services/settings.service";

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

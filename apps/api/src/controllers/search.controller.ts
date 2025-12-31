// External packages
import { Request, Response } from "express";

// Services
import { searchUsersService } from "@/services/search.service";

export async function changeProfileInfo(req: Request, res: Response) {
  try {
    const result = await searchUsersService({
      rawData: req.params,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

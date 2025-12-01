// External packages
import { Request, Response } from "express";

// Services
import { helpConversationService } from "@/services/help.service";

export async function helpConversation(req: Request, res: Response) {
  try {
    const result = await helpConversationService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

// External packages
import { Request, Response } from "express";

// Services
import { helpConversationService } from "@/services/help.service";

export async function helpConversation(req: Request, res: Response) {
  try {
    console.log(req.user.role);
    const result = await helpConversationService({
      rawData: req.body,
      userId: req.user.userId,
      role: req.user.role!, // TODO: I know that role exists because of hasRoleMiddleware, try to fix this
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

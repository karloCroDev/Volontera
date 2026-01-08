// External packages
import { Request, Response } from "express";

// Services
import {
  addQuestionService,
  getHelpMessagesService,
  deleteConversationService,
} from "@/services/help.service";

export async function addQuestionController(req: Request, res: Response) {
  try {
    const result = await addQuestionService({
      data: req.body,
      userId: req.user.userId,
      role: req.user.role!, // TODO: I know that role exists because of hasRoleMiddleware, try to fix this
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function getHelpMessagesController(req: Request, res: Response) {
  try {
    const result = await getHelpMessagesService(req.user.userId);

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function deleteHelpMessagesController(
  req: Request,
  res: Response
) {
  try {
    const result = await deleteConversationService(req.user.userId);

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

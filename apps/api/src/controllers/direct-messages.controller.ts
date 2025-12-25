// External packages
import { Request, Response } from "express";

// Services
import {
  getDirectMessagesConversationByIdService,
  listAllDirectMessagesConversationsService,
  searchAllUsersWithQueryService,
  startConversationOrStartAndSendDirectMessageService,
} from "@/services/direct-messages.service";

export async function searchAllUsersWithQueryController(
  req: Request,
  res: Response
) {
  try {
    const result = await searchAllUsersWithQueryService({
      rawData: req.params,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}
export async function getDirectMessagesConversationByIdServiceController(
  req: Request,
  res: Response
) {
  try {
    const result = await getDirectMessagesConversationByIdService(req.params);
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function listAllDirectMessagesConversationsController(
  req: Request,
  res: Response
) {
  try {
    const result = await listAllDirectMessagesConversationsService(
      req.user.userId
    );
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function startConversationOrStartAndSendDirectMessageController(
  req: Request,
  res: Response
) {
  try {
    const result = await startConversationOrStartAndSendDirectMessageService({
      rawData: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

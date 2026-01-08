// External packages
import { Request, Response } from "express";

// Services
import {
  getDirectMessagesConversationByIdService,
  listAllDirectMessagesConversationsService,
  presignDirectMessageImagesService,
  searchAllUsersWithQueryService,
  startConversationOrStartAndSendDirectMessageService,
} from "@/services/direct-messages.service";

// Schema types
import { ConversationArgs, SearchArgs } from "@repo/schemas/direct-messages";

export async function searchAllUsersWithQueryController(
  req: Request,
  res: Response
) {
  try {
    const result = await searchAllUsersWithQueryService({
      data: req.params as SearchArgs,
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
    const result = await getDirectMessagesConversationByIdService(
      req.params as ConversationArgs
    );
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
      data: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function presignDirectMessageImagesController(
  req: Request,
  res: Response
) {
  try {
    const result = await presignDirectMessageImagesService(req.body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

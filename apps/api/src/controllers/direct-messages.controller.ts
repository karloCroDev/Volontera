// External packages
import { Request, Response } from "express";

// Services
import {
  deleteDirectMessageByIdService,
  getDirectMessagesConversationByIdService,
  listAllDirectMessagesConversationsService,
  searchAllUsersWithQueryService,
  startConversationOrStartAndSendDirectMessageService,
} from "@/services/direct-messages.service";

// Schema types
import {
  ConversationArgs,
  DeleteDirectMessageArgs,
  SearchArgs,
} from "@repo/schemas/direct-messages";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

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
    handleServerErrorResponse(res, err);
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
  } catch (err) {
    handleServerErrorResponse(res, err);
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
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteDirectMessageByIdController(
  req: Request,
  res: Response
) {
  try {
    const result = await deleteDirectMessageByIdService({
      data: req.params as DeleteDirectMessageArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
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
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationGroupChatMessageService,
  deleteOrganizationGroupChatMessageService,
  retrieveAllOrganizationGroupChatMessagesService,
} from "@/services/organization-group-chat.service";

// Schemas
import {
  RetrieveAllOrganizationGroupChatMessagesArgs,
  DeleteOrganizationGroupChatMessageArgs,
} from "@repo/schemas/organization-group-chat";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveAllOrganizationGroupChatMessagesController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveAllOrganizationGroupChatMessagesService(
      req.params as RetrieveAllOrganizationGroupChatMessagesArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createOrganizationGroupChatMessageController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createOrganizationGroupChatMessageService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}
export async function deleteOrganizationGroupChatMessageController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationGroupChatMessageService({
      data: req.params as DeleteOrganizationGroupChatMessageArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

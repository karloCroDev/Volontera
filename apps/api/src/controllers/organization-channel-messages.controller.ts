// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationGroupChatMessageService,
  deleteOrganizationGroupChatMessageService,
  retrieveAllOrganizationGroupChatMessagesService,
} from "@/services/organization-channel-messages.service";

// Schemas
import {
  DeleteOrganizationGroupChatMessageArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
} from "@repo/schemas/organization-channel-messages";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveOrganizationChannelMessagesController(
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

export async function createOrganizationChannelMessageController(
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

export async function deleteOrganizationChannelMessageController(
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

// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationGroupChatChannelService,
  createOrganizationGroupChatMessageService,
  deleteOrganizationGroupChatMessageService,
  deleteOrganizationGroupChatChannelService,
  retrieveAllOrganizationGroupChatMessagesService,
  retrieveOrganizationGroupChatChannelsService,
  updateOrganizationGroupChatChannelService,
} from "@/services/organization-group-chat.service";

// Schemas
import {
  CreateOrganizationGroupChatChannelArgs,
  RetrieveAllOrganizationGroupChatMessagesArgs,
  RetrieveOrganizationGroupChatChannelsArgs,
  DeleteOrganizationGroupChatMessageArgs,
  DeleteOrganizationGroupChatChannelArgs,
  UpdateOrganizationGroupChatChannelArgs,
  CreateOrganizationGroupChatMessageArgs,
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

export async function retrieveOrganizationGroupChatChannelsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveOrganizationGroupChatChannelsService(
      req.params as RetrieveOrganizationGroupChatChannelsArgs,
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

export async function createOrganizationGroupChatChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createOrganizationGroupChatChannelService({
      data: req.body as CreateOrganizationGroupChatChannelArgs,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function updateOrganizationGroupChatChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await updateOrganizationGroupChatChannelService({
      data: req.body as UpdateOrganizationGroupChatChannelArgs,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteOrganizationGroupChatChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationGroupChatChannelService({
      data: req.params as DeleteOrganizationGroupChatChannelArgs,
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

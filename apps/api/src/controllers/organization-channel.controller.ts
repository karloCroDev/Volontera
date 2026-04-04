// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationGroupChatChannelService,
  deleteOrganizationGroupChatChannelService,
  retrieveOrganizationGroupChatChannelsService,
  updateOrganizationGroupChatChannelService,
} from "@/services/organization-channel.service";

// Schemas
import {
  CreateOrganizationChannelArgs,
  DeleteOrganizationChannelArgs,
  RetrieveOrganizationChannelsArgs,
  UpdateOrganizationChannelArgs,
} from "@repo/schemas/organization-channel";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveOrganizationChannelsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveOrganizationGroupChatChannelsService(
      req.params as RetrieveOrganizationChannelsArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createOrganizationChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createOrganizationGroupChatChannelService({
      data: req.body as CreateOrganizationChannelArgs,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function updateOrganizationChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await updateOrganizationGroupChatChannelService({
      data: {
        ...req.params,
        ...req.body,
      } as UpdateOrganizationChannelArgs,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteOrganizationChannelController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationGroupChatChannelService({
      data: req.params as DeleteOrganizationChannelArgs,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

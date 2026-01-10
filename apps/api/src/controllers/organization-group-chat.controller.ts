// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationGroupChatMessageService,
  retrieveAllOrganizationGroupChatMessagesService,
} from "@/services/organization-group-chat.service";

// Schema types
import {
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllMembersInOrganizationArgs,
  RetrieveOrganizationMemberArgs,
} from "@repo/schemas/organization-managment";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";
import { RetrieveAllOrganizationGroupChatMessagesArgs } from "@repo/schemas/organization-group-chat";

export async function retrieveAllOrganizationGroupChatMessagesController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveAllOrganizationGroupChatMessagesService(
      req.params as RetrieveAllOrganizationGroupChatMessagesArgs
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createOrganizationGroupChatMessageController(
  req: Request,
  res: Response
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

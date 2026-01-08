// External packages
import { Request, Response } from "express";

// Services
import {
  acceptOrDeclineUsersRequestToJoinOrganizationService,
  demoteOrPromoteOrganizationMemberService,
  retirveAllRequestsToJoinOrganizationService,
  retrieveAllUsersInOrganizationService,
  retrieveOrganizationMemberService,
} from "@/services/organization-managment.service";

// Schema types
import {
  AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
  DemoteOrPromoteOrganizationMemberArgs,
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllUsersInOrganizationArgs,
  RetrieveOrganizationMemberArgs,
} from "@repo/schemas/organization-managment";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveAllRequestsToJoinOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await retirveAllRequestsToJoinOrganizationService(
      req.params as RetirveAllRequestsToJoinOrganizationArgs
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveAllUsersInOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveAllUsersInOrganizationService(
      req.params as RetrieveAllUsersInOrganizationArgs
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveOrganizationMemberController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveOrganizationMemberService({
      data: req.params as RetrieveOrganizationMemberArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function demoteOrPromoteOrganizationMemberController(
  req: Request,
  res: Response
) {
  try {
    const result = await demoteOrPromoteOrganizationMemberService({
      data: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function acceptOrDeclineUsersRequestToJoinOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await acceptOrDeclineUsersRequestToJoinOrganizationService({
      data: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

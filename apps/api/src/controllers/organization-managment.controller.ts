// External packages
import { Request, Response } from "express";

// Services
import {
  acceptOrDeclineUsersRequestToJoinOrganizationService,
  deleteOrganizationService,
  demoteOrPromoteOrganizationMemberService,
  leaveOrganizationService,
  retirveAllRequestsToJoinOrganizationService,
  retrieveAllMembersInOrganizationService,
  retrieveDataAboutOrganizationService,
  retrieveOrganizationMemberService,
} from "@/services/organization-managment.service";

// Schemas
import {
  DeleteOrganizationArgs,
  LeaveOrganizationArgs,
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllMembersInOrganizationArgs,
  RetrieveDataAboutOrganizationArgs,
  RetrieveOrganizationMemberArgs,
} from "@repo/schemas/organization-managment";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveAllRequestsToJoinOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retirveAllRequestsToJoinOrganizationService(
      req.params as RetirveAllRequestsToJoinOrganizationArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveAllUsersInOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveAllMembersInOrganizationService({
      data: req.params as RetrieveAllMembersInOrganizationArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveOrganizationMemberController(
  req: Request,
  res: Response,
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
  res: Response,
) {
  try {
    const result = await demoteOrPromoteOrganizationMemberService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function acceptOrDeclineUsersRequestToJoinOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await acceptOrDeclineUsersRequestToJoinOrganizationService(
      req.body,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function leaveOrganizationController(req: Request, res: Response) {
  try {
    const result = await leaveOrganizationService({
      data: req.params as LeaveOrganizationArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveDataAboutOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveDataAboutOrganizationService(
      req.params as RetrieveDataAboutOrganizationArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

export async function deleteOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationService({
      data: req.params as DeleteOrganizationArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

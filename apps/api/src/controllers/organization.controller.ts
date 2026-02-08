// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationService,
  getOrganizationDetailsByIdService,
  listOrganizationsOrganizatorService,
  listOrganizationsUserService,
  sendRequestToJoinOrganizationService,
  toggleFollowOrganizationService,
} from "@/services/organization.service";

// Schemas
import {
  GetOrganizationDetailsByIdArgs,
  ToggleFollowOrganizationArgs,
} from "@repo/schemas/organization";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function createOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createOrganizationService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function getOrganizationDetailsByIdController(
  req: Request,
  res: Response,
) {
  try {
    const result = await getOrganizationDetailsByIdService({
      data: req.params as GetOrganizationDetailsByIdArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function listOrganizationsOrganizatorController(
  req: Request,
  res: Response,
) {
  try {
    const result = await listOrganizationsOrganizatorService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function listOrganizationsUserController(
  req: Request,
  res: Response,
) {
  try {
    const result = await listOrganizationsUserService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function sendRequestToJoinOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await sendRequestToJoinOrganizationService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function toggleFollowOrganizationController(
  req: Request,
  res: Response,
) {
  try {
    const result = await toggleFollowOrganizationService({
      data: req.params as ToggleFollowOrganizationArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// External packages
import { Request, Response } from "express";

// Services
import {
  banUserService,
  retrieveKPIMetricsService,
  retrievePaginatedUsersService,
  unbanUserService,
} from "@/services/dashboard.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveKPIMetricsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveKPIMetricsService({ data: req.body });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrievePaginatedUsersController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrievePaginatedUsersService({
      data: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// TODO: Karlo vidi hoću ovo kao jedan controller ili da ostavim ovako
export async function banUserController(req: Request, res: Response) {
  try {
    const result = await banUserService({
      data: req.body,
      adminUserId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function unbanUserController(req: Request, res: Response) {
  try {
    const result = await unbanUserService({
      data: req.body,
      adminUserId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

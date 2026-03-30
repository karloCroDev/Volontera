// External packages
import { Request, Response } from "express";

// Schemas
import {
  dashboardKPIMetricsQuerySchema,
  dashboardUsersPaginationQuerySchema,
} from "@repo/schemas/dashboard";
import { userSchema } from "@repo/schemas/user";

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
  const data = dashboardKPIMetricsQuerySchema.parse(req.query);
  try {
    const result = await retrieveKPIMetricsService({ data });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrievePaginatedUsersController(
  req: Request,
  res: Response,
) {
  const data = dashboardUsersPaginationQuerySchema.parse(req.query);
  try {
    const result = await retrievePaginatedUsersService({
      data,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// TODO: Karlo vidi hoću ovo kao jedan controller ili da ostavim ovako
export async function banUserController(req: Request, res: Response) {
  const data = userSchema.parse(req.body);

  try {
    const result = await banUserService({
      userId: data.userId,
      adminUserId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function unbanUserController(req: Request, res: Response) {
  const data = userSchema.parse(req.body);

  try {
    const result = await unbanUserService({
      userId: data.userId,
      adminUserId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

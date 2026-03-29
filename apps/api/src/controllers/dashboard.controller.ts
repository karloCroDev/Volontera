// External packages
import { Request, Response } from "express";

// Schemas
import {
  dashboardKPIMetricsQuerySchema,
  dashboardUsersPaginationQuerySchema,
} from "@repo/schemas/dashboard";

// Services
import {
  retrieveKPIMetricsService,
  retrievePaginatedUsersService,
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

// External packages
import { Request, Response } from "express";

// Services
import {
  createOrganizationEventService,
  deleteOrganizationEventService,
  retrieveOrganizationCalendarService,
  updateOrganizationEventService,
} from "@/services/organization-calendar.service";

// Schemas
import {
  CreateOrganizationEventArgs,
  DeleteOrganizationEventArgs,
  retrieveOrganizationCalendarArgsSchema,
  UpdateOrganizationEventArgs,
} from "@repo/schemas/organization-calendar";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveOrganizationCalendarController(
  req: Request,
  res: Response,
) {
  try {
    const data = retrieveOrganizationCalendarArgsSchema.parse({
      ...req.params,
      ...req.query,
    });

    const result = await retrieveOrganizationCalendarService(data);

    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

export async function createOrganizationEventController(
  req: Request,
  res: Response,
) {
  try {
    const result = await createOrganizationEventService({
      data: req.body as CreateOrganizationEventArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

export async function updateOrganizationEventController(
  req: Request,
  res: Response,
) {
  try {
    const result = await updateOrganizationEventService(
      req.body as UpdateOrganizationEventArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

export async function deleteOrganizationEventController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationEventService(
      req.params as DeleteOrganizationEventArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (error) {
    handleServerErrorResponse(res, error);
  }
}

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
  RetrieveOrganizationCalendarArgs,
  UpdateOrganizationEventArgs,
} from "@repo/schemas/organization-calendar";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrieveOrganizationCalendarController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveOrganizationCalendarService(
      req.params as RetrieveOrganizationCalendarArgs,
    );

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
    const result = await createOrganizationEventService(
      req.body as CreateOrganizationEventArgs,
    );

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

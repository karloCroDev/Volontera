// External packages
import { Request, Response } from "express";

// Services
import {
  endOrganizationVideoMeetingService,
  getOrganizationVideoMeetingStateService,
  joinOrganizationVideoMeetingService,
  leaveOrganizationVideoMeetingService,
  startOrganizationVideoMeetingService,
} from "@/services/organization-video-meeting.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

// Schemas
import { AllOrganizationVideoMeetingArgs } from "@repo/schemas/organization-video-meeting";

export async function getOrganizationVideoMeetingStateController(
  req: Request,
  res: Response,
) {
  try {
    const result = await getOrganizationVideoMeetingStateService(
      req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function startOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await startOrganizationVideoMeetingService({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function joinOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await joinOrganizationVideoMeetingService({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function leaveOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await leaveOrganizationVideoMeetingService({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function endOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await endOrganizationVideoMeetingService({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

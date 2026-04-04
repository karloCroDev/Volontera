// External packages
import { Request, Response } from "express";

// Services
import {
  endOrganizationVideoMeeting,
  getOrganizationVideoMeetingState,
  joinOrganizationVideoMeeting,
  leaveOrganizationVideoMeeting,
  startOrganizationVideoMeeting,
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
    const result = await getOrganizationVideoMeetingState(
      req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
    );

    return res.status(200).json({
      success: true,
      message: "Video meeting state retrieved successfully",
      ...result,
    });
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function startOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await startOrganizationVideoMeeting({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Video meeting started successfully",
      ...result,
    });
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function joinOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await joinOrganizationVideoMeeting({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No active meeting found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Joined video meeting successfully",
      ...result,
    });
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function leaveOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await leaveOrganizationVideoMeeting({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: result.ended
        ? "Video meeting ended successfully"
        : "Left video meeting successfully",
      ...result,
    });
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function endOrganizationVideoMeetingController(
  req: Request,
  res: Response,
) {
  try {
    const result = await endOrganizationVideoMeeting({
      organizationId: req.params
        .organizationId as AllOrganizationVideoMeetingArgs["organizationId"],
    });

    return res.status(200).json({
      success: true,
      message: result.ended
        ? "Video meeting ended successfully"
        : "No active meeting found",
      ...result,
    });
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

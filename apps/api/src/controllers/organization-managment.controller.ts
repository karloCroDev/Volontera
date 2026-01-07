// External packages
import { Request, Response } from "express";

// Services
import {
  retirveAllRequestsToJoinOrganizationService,
  retrieveAllUsersInOrganizationService,
  retrieveOrganizationMemberService,
} from "@/services/organization-managment.service";

export async function retrieveAllRequestsToJoinOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await retirveAllRequestsToJoinOrganizationService({
      rawData: req.params,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function retrieveAllUsersInOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveAllUsersInOrganizationService({
      rawData: req.params,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function retrieveOrganizationMemberController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveOrganizationMemberService({
      rawData: req.params,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

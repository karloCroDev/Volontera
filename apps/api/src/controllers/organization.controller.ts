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
import {
  GetOrganizationDetailsByIdArgs,
  ToggleFollowOrganizationArgs,
} from "@repo/schemas/organization";

export async function createOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await createOrganizationService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function getOrganizationDetailsByIdController(
  req: Request,
  res: Response
) {
  try {
    const result = await getOrganizationDetailsByIdService(
      req.params as GetOrganizationDetailsByIdArgs
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function listOrganizationsOrganizatorController(
  req: Request,
  res: Response
) {
  try {
    const result = await listOrganizationsOrganizatorService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function listOrganizationsUserController(
  req: Request,
  res: Response
) {
  try {
    const result = await listOrganizationsUserService(req.user.userId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function sendRequestToJoinOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await sendRequestToJoinOrganizationService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function toggleFollowOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await toggleFollowOrganizationService({
      data: req.params as ToggleFollowOrganizationArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

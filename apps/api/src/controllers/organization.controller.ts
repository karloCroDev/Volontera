// External packages
import { Request, Response } from "express";

// Services
import {
  CreateOrganizationService,
  getOrganizationDetailsByIdService,
} from "@/services/organization.service";

export async function createOrganizationController(
  req: Request,
  res: Response
) {
  try {
    const result = await CreateOrganizationService({
      rawData: req.body,
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
    const result = await getOrganizationDetailsByIdService(req.params);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

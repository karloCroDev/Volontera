// External packages
import { Request, Response } from "express";

// Service
import { getImageFromKeyService } from "@/services/image.service";
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function getImageFromKeyController(req: Request, res: Response) {
  try {
    const serviceResponse = await getImageFromKeyService(req.body);
    return res.status(serviceResponse.status).json(serviceResponse.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

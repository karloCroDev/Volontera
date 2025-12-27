// External packages
import { Request, Response } from "express";

// Service
import { getImageFromKeyService } from "@/services/image.service";

export async function getImageFromKeyController(req: Request, res: Response) {
  const userId = req.user.userId;
  const serviceResponse = await getImageFromKeyService({
    rawData: req.body,
    userId,
  });
  return res.status(serviceResponse.status).json(serviceResponse.body);
}

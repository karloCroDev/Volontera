// External packages
import { Request, Response } from "express";

// Service
import { getImageFromKeyService } from "@/services/image.service";

export async function getImageFromKeyController(req: Request, res: Response) {
  const serviceResponse = await getImageFromKeyService({
    rawData: req.body,
  });
  return res.status(serviceResponse.status).json(serviceResponse.body);
}

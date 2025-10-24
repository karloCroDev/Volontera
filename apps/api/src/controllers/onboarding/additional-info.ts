// External packages
import { Request, Response } from "express";

// Config
import { prisma } from "@/config/prisma";

// Schemas
import {
  AdditionalFormArgs,
  additionalInformationSchema,
} from "@repo/schemas/onboarding";

export async function addtionalInformation(req: Request, res: Response) {
  const data = req.body;
  const { success, data: additionalInfoData } =
    additionalInformationSchema.safeParse(data);

  if (!success) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  const payload: Partial<Omit<AdditionalFormArgs, "image">> = {};

  if (additionalInfoData.image) {
    // Handle image with s3
  }

  if (additionalInfoData.bio) {
    payload.bio = additionalInfoData.bio;
  }

  if (additionalInfoData.DOB) {
    payload.DOB = additionalInfoData.DOB;
  }

  await prisma.user.update({
    where: {
      id: req.user.userId,
    },
    data: {
      ...payload,
      //   image: additionalInfoData.image?.filename, // Handle the image
    },
  });

  return res.status(200).json({
    title: "Information saved",
    message: "Your additional information has been saved successfully",
  });
}

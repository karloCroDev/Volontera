// External packages
import { Request, Response } from "express";

// Config
import { prisma } from "@/config/prisma";

// Schemas
import {
  AdditionalFormArgs,
  additionalInformationSchema,
} from "@repo/schemas/onboarding";
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

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

  const user = await prisma.user.update({
    where: {
      id: req.user.userId,
    },
    data: {
      ...payload,
      onboardingFinished: true,
      //   image: additionalInfoData.image?.filename, // Handle the image
    },
  });

  generateTokenAndSetCookie({
    res,
    userId: user.id,
    role: user.role,
    onboardingFinished: true,
  });
  return res.status(200).json({
    title: "Account created",
    message: "Also your additional information has been saved successfully :)",
  });
}

export async function skipAdditionalInformation(req: Request, res: Response) {
  const { userId } = req.user;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      onboardingFinished: true,
    },
  });
  if (!user) {
    return res.status(400).json({
      message: "There has been with enetring the app (user non existent)",
    });
  }

  generateTokenAndSetCookie({
    res,
    userId: user.id,
    role: user.role,
    onboardingFinished: true,
  });

  return res.status(200).json({
    title: "Account created",
    message: "Also your additional information has been saved successfully :)",
  });
}

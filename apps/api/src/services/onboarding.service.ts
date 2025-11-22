// External packages
import { Response } from "express";

// Models
import {
  finishOnboarding,
  updateUserOnboarding,
} from "@/models/onboarding.model";

// Local packaes
import {
  AdditionalFormArgs,
  additionalInformationSchema,
} from "@repo/schemas/onboarding";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

export async function additionalInformationService(
  rawData: unknown,
  userId: string
) {
  const { success, data } = additionalInformationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: { message: "Invalid data provided" },
    };
  }

  const payload: Partial<Omit<AdditionalFormArgs, "image">> = {};

  if (data.image) {
    // S3 logic here in future
  }

  if (data.bio) payload.bio = data.bio;
  if (data.DOB) payload.DOB = data.DOB;

  const user = await updateUserOnboarding({ data: payload, userId });

  // Add this in controller
  //   generateTokenAndSetCookie({
  //     res,
  //     userId: user.id,
  //     role: user.role,
  //     onboardingFinished: true,
  //   });

  return {
    user,
    status: 200,
    body: {
      title: "Account created",
      message: "Additional information saved successfully",
    },
  };
}

export async function skipAdditionalInformationService(userId: string) {
  const user = await finishOnboarding(userId);

  if (!user) {
    return {
      status: 400,
      body: {
        message: "User not found",
      },
    };
  }

  return {
    user,
    status: 200,
    body: {
      title: "Account created",
      message: "Onboarding completed successfully",
    },
  };
}

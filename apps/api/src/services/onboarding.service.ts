// Models
import {
  finishOnboarding,
  updateUserAppType,
  updateUserOnboarding,
} from "@/models/onboarding.model";

// Local packaes
import {
  AdditionalFormArgs,
  additionalInformationSchema,
} from "@repo/schemas/onboarding";

export async function additionalInformationService(
  rawData: unknown,
  userId: string
) {
  const { success, data } = additionalInformationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "Invalid data provided",
        title: "Please provide the correct data",
      },
    };
  }

  const payload: Partial<Omit<AdditionalFormArgs, "image">> = {};

  if (data.image) {
    // S3 logic here in future
  }

  if (data.bio) payload.bio = data.bio;
  if (data.DOB) payload.DOB = data.DOB;

  const user = await updateUserOnboarding({ data: payload, userId });

  return {
    status: 200,
    body: {
      title: "Account created",
      message: "Additional information saved successfully",
      user,
    },
  };
}

export async function skipAdditionalInformationService(userId: string) {
  const user = await finishOnboarding(userId);

  if (!user) {
    return {
      status: 400,
      body: {
        title: "Account creation failed",
        message: "Could not finish onboarding for the user",
      },
    };
  }

  return {
    status: 200,
    body: {
      title: "Account created",
      message: "Onboarding finished successfully",
      user,
    },
  };
}

// app-type.service.ts

import { AppType } from "@repo/types/onboarding";

export async function appTypeService(rawType: unknown, userId: string) {
  const type = rawType as AppType;

  if (type !== "USER" && type !== "ORGANIZATION") {
    return {
      status: 400,
      body: { message: "Invalid app type provided" },
    };
  }

  const updated = await updateUserAppType({ type, userId });

  if (!updated) {
    return {
      status: 400,
      body: {
        message: "There was an error choosing the app type (user not found)",
      },
    };
  }

  return {
    status: 200,
    body: {
      title: "App type saved",
      message: "Your app type has been saved successfully",
      role: type,
    },
  };
}

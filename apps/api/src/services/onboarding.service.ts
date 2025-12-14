// Models
import { createUploadUrl, deleteImage } from "@/models/image.model";
import {
  finishOnboarding,
  updateUserAppType,
  updateUserOnboarding,
} from "@/models/onboarding.model";
import { User } from "@prisma/client";

// Schemas
import { additionalInformationSchema } from "@repo/schemas/onboarding";

// Simmilar logic as settings.service.ts keeping separated because of additional options when user onboards (that are only available to onboading)
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

  const payload: Partial<User> = {};

  if (data.bio) payload.bio = data.bio;
  if (data.DOB) payload.DOB = data.DOB;

  if (data.image?.deleteImage) {
    await deleteImage(data.image.deleteImage);

    payload.image = "";
  }
  let presignedURL = "";
  if (data.image) {
    const imageURL = await createUploadUrl(data.image);
    payload.image = imageURL.key;
    presignedURL = imageURL.url;
  }

  await updateUserOnboarding({ data: payload, userId });

  return {
    status: 200,
    body: {
      title: "Account created",
      message: "Additional information saved successfully",
      presignedURL,
    },
  };
}

export async function skipAdditionalInformationService(userId: string) {
  await finishOnboarding(userId);

  return {
    status: 200,
    body: {
      title: "Account created",
      message: "Onboarding finished successfully",
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

  await updateUserAppType({ type, userId });

  return {
    status: 200,
    body: {
      title: "App type saved",
      message: "Your app type has been saved successfully",
      role: type,
    },
  };
}

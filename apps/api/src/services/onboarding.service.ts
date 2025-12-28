// External packages
import { createElement } from "react";

// Database
import { User } from "@repo/database";

// Models
import { resend } from "@/config/resend";
import { findUserById } from "@/models/user.model";
import { createUploadUrl, deleteImage } from "@/lib/aws-s3-functions";
import {
  finishOnboarding,
  updateUserAppType,
  updateUserOnboarding,
} from "@/models/onboarding.model";

// Schemas
import { additionalInformationSchema } from "@repo/schemas/onboarding";

// Transactional emails
import { WelcomeEmail } from "@repo/transactional/welcome-email";

// Types
import { AppType } from "@repo/types/onboarding";

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

  const user = await findUserById(userId);

  if (user) {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: user.email,
      subject: "Welcome to the [app]",
      react: createElement(WelcomeEmail, {
        firstName: user.firstName,
      }),
    });
  }

  return {
    status: 200,
    body: {
      title: "Account created",
      message: "Additional information saved successfully",
      user,
      presignedURL,
    },
  };
}

export async function skipAdditionalInformationService(userId: string) {
  await finishOnboarding(userId);

  const user = await findUserById(userId);

  if (user) {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: user.email,
      subject: "Welcome to the [app]",
      react: createElement(WelcomeEmail, {
        firstName: user.firstName,
      }),
    });
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

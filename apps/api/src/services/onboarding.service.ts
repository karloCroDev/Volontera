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
import {
  additionalInformationSchema,
  AdditionalFormArgs,
  AppTypeSchemaArgs,
} from "@repo/schemas/onboarding";

// Transactional emails
import { WelcomeEmail } from "@repo/transactional/welcome-email";

export async function additionalInformationService({
  data,
  userId,
}: {
  data: AdditionalFormArgs;
  userId: User["id"];
}) {
  const imagePayload: Partial<User> = {};

  if (data.image?.deleteImage) {
    await deleteImage(data.image.deleteImage);
    imagePayload.image = null;
  }

  let presignedURL = "";
  if (data.image) {
    const imageURL = await createUploadUrl(data.image);
    imagePayload.image = imageURL.key;
    presignedURL = imageURL.url;
  }

  await updateUserOnboarding({
    data: {
      ...data,
      image: imagePayload.image,
    },
    userId,
  });

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

export async function skipAdditionalInformationService(userId: User["id"]) {
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

export async function appTypeService({
  data,
  userId,
}: {
  data: AppTypeSchemaArgs;
  userId: User["id"];
}) {
  await updateUserAppType({ type: data.appType, userId });

  return {
    status: 200,
    body: {
      title: "App type saved",
      message: "Your app type has been saved successfully",
      role: data.appType,
    },
  };
}

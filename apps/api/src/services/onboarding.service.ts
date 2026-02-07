// External packages
import { createElement } from "react";

// Database
import { User } from "@repo/database";

// Models
import { resend } from "@/lib/config/resend";
import { findUserById } from "@/models/user.model";
import { createUploadUrl, deleteImage } from "@/lib/aws-s3-functions";
import {
  finishOnboarding,
  updateUserAppType,
  updateUserOnboarding,
} from "@/models/onboarding.model";

// Schemas
import {
  AdditionalFormArgs,
  AppTypeSchemaArgs,
} from "@repo/schemas/onboarding";

// Transactional emails
import { WelcomeEmail } from "@repo/transactional/welcome-email";
import { toastResponseOutput } from "@/lib/utils/service-output";

export async function additionalInformationService({
  data,
  userId,
}: {
  data: AdditionalFormArgs;
  userId: User["id"];
}) {
  const imagePayload: Partial<User> = {};

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
      subject: "Welcome to the Volontera",
      react: createElement(WelcomeEmail, {
        firstName: user.firstName,
      }),
    });
  }

  return toastResponseOutput({
    status: 200,
    title: "Account created",
    message: "Additional information saved successfully",
    data: { user, presignedURL },
  });
}

export async function skipAdditionalInformationService(userId: User["id"]) {
  await finishOnboarding(userId);

  const user = await findUserById(userId);

  if (user) {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: user.email,
      subject: "Welcome to the Volontera",
      react: createElement(WelcomeEmail, {
        firstName: user.firstName,
      }),
    });
  }

  return toastResponseOutput({
    status: 200,
    title: "Account created",
    message: "Onboarding finished successfully",
    data: { user },
  });
}

export async function appTypeService({
  data,
  userId,
}: {
  data: AppTypeSchemaArgs;
  userId: User["id"];
}) {
  await updateUserAppType({ type: data.appType, userId });

  return toastResponseOutput({
    status: 200,
    title: "App type saved",
    message: "Your app type has been saved successfully",
    data: { role: data.appType },
  });
}

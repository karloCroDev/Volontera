// External packages
import { User } from "@prisma/client";

// Services
import { createUploadUrl, deleteImage } from "@/models/image.model";

import { settingsSchema } from "@repo/schemas/settings";
import { updateUsersInformation } from "@/models/settings.model";

export async function changeProfileInfoService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: string;
}) {
  const { success, data } = settingsSchema.safeParse(rawData);

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

  if (data.firstName) payload.firstName = data.firstName;
  if (data.lastName) payload.lastName = data.lastName;
  if (data.DOB) payload.DOB = data.DOB;
  if (data.workOrSchool) payload.workOrSchool = data.workOrSchool;
  if (data.bio) payload.bio = data.bio;

  if (data.deleteImage) {
    await deleteImage(data.deleteImage);

    payload.image = "";
  }

  if (data.image) {
    await createUploadUrl(data.image);
  }

  await updateUsersInformation({ data: payload, userId });

  return {
    status: 200,
    body: {
      title: "Profile updated",
      message: "Your profile information has been updated successfully",
    },
  };
}

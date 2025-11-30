// External packages
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

// Services
import { createUploadUrl, deleteImage } from "@/models/image.model";

// Schemas
import {
  resetPasswordSettingsSchema,
  settingsSchema,
} from "@repo/schemas/settings";
import {
  getUsersOldPassword,
  updateUsersInformation,
  updateUsersPassword,
} from "@/models/settings.model";

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

export async function resetPasswordInAppService({
  rawData,
  userId,
}: {
  userId: string;
  rawData: unknown;
}) {
  // Validate incoming data
  const { success, data } = resetPasswordSettingsSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        message: "Invalid data provided",
      },
    };
  }

  // Fetch user
  const currentPasswordInUse = await getUsersOldPassword(userId);
  if (!currentPasswordInUse) {
    return {
      status: 400,
      body: {
        message: "Users password not found",
      },
    };
  }

  // Verify current password
  const matches = await bcrypt.compare(
    data.currentPassword,
    currentPasswordInUse
  );
  if (!matches) {
    return {
      status: 400,
      body: {
        message: "Current password does not match with our records",
      },
    };
  }

  // Ensure new password is not the same as current password
  const isSame = await bcrypt.compare(data.newPassword, currentPasswordInUse);
  if (isSame) {
    return {
      status: 400,
      body: {
        message: "New password cannot be the same as the current password",
      },
    };
  }

  // Hash new password
  const hashedNewPassword = bcrypt.hashSync(data.newPassword, 10);

  await updateUsersPassword({
    newPassword: hashedNewPassword,
    userId,
  });

  return {
    status: 200,
    body: {
      title: "Password changed successfully",
      message: "You have successfully changed your password",
    },
  };
}

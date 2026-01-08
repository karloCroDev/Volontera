// External packages
import bcrypt from "bcrypt";
import { createElement } from "react";

// Database
import { User } from "@repo/database";

// Services
import { createUploadUrl, deleteImage } from "@/lib/aws-s3-functions";

// Schemas
import {
  ResetPasswordSettingsArgs,
  SettingsArgs,
} from "@repo/schemas/settings";

// Models
import {
  deleteUserAccount,
  getUsersOldPassword,
  updateUsersInformation,
  updateUsersPassword,
} from "@/models/settings.model";
import { findUserById } from "@/models/user.model";

// Config
import { resend } from "@/config/resend";

// Transactional emails
import { DeletedAccount } from "@repo/transactional/deleted-account";

export async function changeProfileInfoService({
  data,
  userId,
}: {
  data: SettingsArgs;
  userId: string;
}) {
  const imagePayload: Partial<User> = {};

  if (data.image?.deleteImage) {
    await deleteImage(data.image.deleteImage);
    imagePayload.image = "";
  }

  let presignedURL = "";
  if (data.image) {
    const imageURL = await createUploadUrl(data.image);
    imagePayload.image = imageURL.key;
    presignedURL = imageURL.url;
  }

  await updateUsersInformation({
    data: {
      ...data,
      image: imagePayload.image,
    },
    userId,
  });
  return {
    status: 200,
    body: {
      title: "Profile updated",
      message: "Your profile information has been updated successfully",
      presignedURL,
    },
  };
}

export async function resetPasswordInAppService({
  data,
  userId,
}: {
  userId: string;
  data: ResetPasswordSettingsArgs;
}) {
  // Fetch user
  const currentPasswordInUse = await getUsersOldPassword(userId);
  if (!currentPasswordInUse) {
    return {
      status: 400,
      body: {
        message: "You cannot change password for this account (social login)",
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

export async function deleteAccountService({ userId }: { userId: User["id"] }) {
  const deletedAccount = await deleteUserAccount(userId);

  const user = await findUserById(userId);

  if (user) {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: user.email,
      subject: "Account successfuly deleted from [app]",
      react: createElement(DeletedAccount, {
        firstName: user.firstName,
      }),
    });
  }

  if (!deletedAccount) {
    return {
      status: 400,
      body: {
        message: "Failed to delete account",
      },
    };
  }

  return {
    status: 200,
    body: {
      title: "Account deleted",
      message: "Your account has been deleted successfully",
    },
  };
}

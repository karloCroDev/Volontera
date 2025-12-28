// Lib
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";

// Models
import { findUserById } from "@/models/user.model";

export async function getUserByIdService(userId: string) {
  const user = await findUserById(userId);

  if (!user)
    return {
      status: 400,
      body: {
        message: "There is no user that we could find with that ID",
        success: false,
      },
    };

  let userData = user;

  if (user.image) {
    const image = await getImagePresignedUrls(user.image);
    userData = { ...user, image };
  }
  return {
    status: 200,
    body: {
      message: "User fetched successfully",
      success: true,
      ...userData,
    },
  };
}

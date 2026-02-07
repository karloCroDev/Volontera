// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Models
import {
  findUserById,
  retrieveAllOrganizationsForUser,
  retrieveAllPostsForUser,
} from "@/models/user.model";

// Schemas
import { UserSchemaArgs } from "@repo/schemas/user";

export async function getUserByIdService({ userId }: UserSchemaArgs) {
  const user = await findUserById(userId);

  if (!user) {
    return serverFetchOutput({
      message: "There is no user that we could find with that ID",
      success: false,
      status: 400,
    });
  }

  return serverFetchOutput({
    status: 200,
    message: "User fetched successfully",
    success: true,
    data: user,
  });
}

export async function retrieveAllOrganizationsForUserService({
  userId,
}: UserSchemaArgs) {
  const organizations = await retrieveAllOrganizationsForUser(userId);
  return serverFetchOutput({
    status: 200,
    message: "Attending organizations fetched successfully",
    success: true,
    data: { organizations },
  });
}

export async function retrieveAllPostsForUserService({
  userId,
}: UserSchemaArgs) {
  const posts = await retrieveAllPostsForUser(userId);

  return serverFetchOutput({
    status: 200,
    message: "Users posts fetched successfully",
    success: true,
    data: { posts },
  });
}

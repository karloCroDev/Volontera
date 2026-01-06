// Models
import { searchUsers } from "@/models/search.model";

// Database
import { User } from "@repo/database";

// Schemas
import { searchUserSchema } from "@repo/schemas/search";

export async function searchUsersService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = searchUserSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "Invalid request data",
      },
    };
  }

  const { organizations, users } = await searchUsers({
    query: data.query,
    userId,
  });

  return {
    status: 200,
    body: {
      message: "Search results fetched successfully",
      organizations,
      users,
    },
  };
}

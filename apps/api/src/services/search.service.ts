// Models
import { searchUsers } from "@/models/search.model";

// Database
import { User } from "@repo/database";

// Schemas
import { searchUserSchema, SearchUserArgs } from "@repo/schemas/search";

export async function searchUsersService({
  data,
  userId,
}: {
  data: SearchUserArgs;
  userId: User["id"];
}) {
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

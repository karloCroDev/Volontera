// Models
import { searchUsers } from "@/models/search.model";

// Lib
import { toastResponseOutput } from "@/lib/utils/service-output";

// Database
import { User } from "@repo/database";

// Schemas
import { SearchUserArgs } from "@repo/schemas/search";

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

  return toastResponseOutput({
    status: 200,
    message: "Search results fetched successfully",
    title: "Search Completed",
    data: { organizations, users },
  });
}

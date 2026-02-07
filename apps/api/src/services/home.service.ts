// Database
import { User } from "@repo/database";

// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Models
import { retrieveAlgoPosts } from "@/models/home.model";

// Schemas
import { RetrieveAlgoPostsSchemaArgs } from "@repo/schemas/home";

export async function retrieveRecentAlgoPostsService({
  userId,
  data,
}: {
  userId: User["id"];
  data: RetrieveAlgoPostsSchemaArgs;
}) {
  const posts = await retrieveAlgoPosts({
    userId,
    offset: data.offset,
    limit: data.limit,
    filter: data.filter,
  });
  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved algorithmic posts",
    success: true,
    data: { posts },
  });
}

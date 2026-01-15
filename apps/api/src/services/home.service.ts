// Lib
import { serverFetchOutput } from "@/lib/utils/service-output";

// Models
import {
  retrieveAlgoPosts,
  retrieveFollowedAlgoPosts,
} from "@/models/home.model";
import { User } from "@repo/database";
import { RetrieveAlgoPostsSchema } from "@repo/schemas/home";

export async function retrieveRecentAlgoPostsService({
  userId,
  data,
}: {
  userId: User["id"];
  data: RetrieveAlgoPostsSchema;
}) {
  const posts = await retrieveAlgoPosts({
    userId,
    offset: data.offset,
    limit: data.limit,
  });

  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved algorithmic posts",
    success: true,
    data: { posts },
  });
}

export async function retrieveRecentFollowedAlgoPostsService({
  userId,
  data,
}: {
  userId: User["id"];
  data: RetrieveAlgoPostsSchema;
}) {
  const posts = await retrieveFollowedAlgoPosts({
    userId,
    offset: data.offset,
    limit: data.limit,
  });
  return serverFetchOutput({
    status: 200,
    message: "Successfully retrieved followed algorithmic posts",
    success: true,
    data: { posts },
  });
}

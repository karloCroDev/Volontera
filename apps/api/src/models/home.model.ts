// Database
import { prisma, User } from "@repo/database";
import { RetrieveAlgoPostsSchemaArgs } from "@repo/schemas/home";

export async function retrieveAlgoPosts({
  userId,
  offset = 0,
  limit = 10,
  filter,
}: {
  userId: User["id"];
  offset?: number;
  limit?: number;
  filter: RetrieveAlgoPostsSchemaArgs["filter"];
}) {
  return prisma.post.findMany({
    include: {
      organization: {
        include: {
          organizationFollowers:
            filter === "following"
              ? {
                  where: {
                    followerUserId: userId,
                  },
                }
              : false,
        },
      },

      postImages: true,
      postLikes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          postComments: true,
          postLikes: true,
        },
      },
      author: {
        omit: {
          password: true,
        },
      },
    },
    skip: +offset,
    take: +limit,
  });
}

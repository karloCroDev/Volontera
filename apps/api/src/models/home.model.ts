// Database
import { Post, prisma, User } from "@repo/database";
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

export async function retrieveCronPosts() {
  return prisma.post.findMany({
    include: {
      author: {
        select: {
          subscriptionTier: true,
        },
      },
      organization: {
        include: {
          owner: {
            select: {
              subscriptionTier: true,
            },
          },
        },

        select: {
          createdAt: true,
          _count: {
            select: {
              organizationFollowers: true,
              organizationMembers: true,
            },
          },
        },
      },
      _count: {
        select: {
          postComments: true,
          postLikes: true,
          postImages: true,
        },
      },
    },
    orderBy: {
      // Od najnovijih do najstarijih postova (najnoviji imaju prednost kod vrednovanja unutar algoritma)
      createdAt: "desc",
    },
  });
}

export async function updatePostRankingScore({
  postId,
  rankingScore,
}: {
  postId: Post["id"];
  rankingScore: Post["rankingScore"];
}) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      rankingScore,
    },
  });
}

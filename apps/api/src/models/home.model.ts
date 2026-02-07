// Database
import { Post, prisma, User } from "@repo/database";

// Schemas
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
  filter?: RetrieveAlgoPostsSchemaArgs["filter"];
}) {
  return prisma.post.findMany({
    where:
      filter === "following"
        ? {
            organization: {
              organizationFollowers: {
                some: {
                  followerUserId: userId,
                },
              },
            },
          }
        : undefined,
    include: {
      organization: {
        include: {
          _count: {
            select: {
              organizationFollowers: true,
              organizationMembers: true,
            },
          },
          organizationFollowers:
            filter === "following"
              ? {
                  where: {
                    followerUserId: userId,
                  },
                }
              : false,
          owner: {
            omit: {
              password: true,
            },
          },
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
        select: {
          createdAt: true,
          owner: {
            select: {
              subscriptionTier: true,
            },
          },
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

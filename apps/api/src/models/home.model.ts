// Database
import { prisma, User } from "@repo/database";

export async function retrieveAlgoPosts({
  userId,
  offset = 0,
  limit = 10,
}: {
  userId: User["id"];
  offset?: number;
  limit?: number;
}) {
  return prisma.post.findMany({
    include: {
      organization: true,
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
    skip: offset,
    take: limit,
  });
}

export async function retrieveFollowedAlgoPosts({
  userId,
  offset = 0,
  limit = 10,
}: {
  userId: User["id"];
  offset?: number;
  limit?: number;
}) {
  return prisma.organization.findMany({
    where: {
      organizationFollowers: {
        some: {
          followerUserId: userId,
        },
      },
    },
    include: {
      posts: {
        include: {
          organization: true,
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
      },
    },
    skip: offset,
    take: limit,
  });
}

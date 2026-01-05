// Database
import { Organization, Post, prisma, User } from "@repo/database";

// Organization admins only
type PostMangmentArgs = {
  title: Post["title"];
  content: Post["content"];
  images: string[];
};

export async function createPost({
  title,
  content,
  images,
  userId,
  organizationId,
}: PostMangmentArgs & {
  userId: User["id"];
  organizationId: Organization["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      content,
      organizationId,
      authorId: userId,
      postImages: {
        create: images.map((imageUrl) => ({ imageUrl })),
      },
    },
  });
}

export async function deletePost(postId: Post["id"]) {
  return prisma.post.delete({
    where: { id: postId },
  });
}

export async function updatePost({
  postId,
  title,
  content,
  images,
}: PostMangmentArgs & {
  postId: Post["id"];
}) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      postImages: {
        deleteMany: {},
        create: images.map((imageUrl) => ({ imageUrl })),
      },
    },
  });
}

export async function retrievePostData(postId: Post["id"]) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      postImages: true,
    },
  });
}

// Everyone
export async function retrieveOrganizationPosts({
  userId,
  organizationId,
}: {
  userId: User["id"];
  organizationId: Organization["id"];
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
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function retrievePostWithComments({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      organization: true,
      postImages: true,
      author: true,
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
      postComments: {
        include: {
          author: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
}

export async function retrieveComments(postId: Post["id"]) {
  return prisma.postComments.findMany({
    where: {
      postId,
    },
  });
}

export async function checkIfUserLiked({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.postLikes.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
}
export async function likePost({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.postLikes.create({
    data: {
      postId,

      userId,
    },
  });
}

export async function dislikePost({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.postLikes.delete({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });
}

// Home (with cool algorithm later)
export async function retrieveHomePosts() {
  return prisma.post.findMany({
    include: {
      organization: true,
      postImages: true,
      author: true,
    },
  });
}

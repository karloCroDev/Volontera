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
export async function retrieveOrganizationPosts(
  organizationId: Organization["id"]
) {
  return prisma.post.findMany({
    include: {
      organization: true,
      postImages: true,
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

export async function retrievePostWithComments(postId: Post["id"]) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      organization: true,
      postImages: true,
      author: true,
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

type LikeOrDislikePostArgs = {
  postId: Post["id"];
  userId: User["id"];
};

export async function likePost({ postId, userId }: LikeOrDislikePostArgs) {
  return prisma.postLikes.upsert({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
    update: {},
    create: {
      postId,
      userId,
    },
  });
}

export async function dislikePost({ postId, userId }: LikeOrDislikePostArgs) {
  return prisma.postLikes.deleteMany({
    where: {
      postId,
      userId,
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

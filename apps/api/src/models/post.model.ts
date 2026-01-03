// Database
import { Organization, Post, prisma, User } from "@repo/database";

export async function createPost({
  title,
  content,
  images,
  userId,
  organizationId,
}: {
  title: Post["title"];
  content: Post["content"];
  images: string[];
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

export async function retrievePosts(organizationId: Organization["id"]) {
  return prisma.post.findMany({
    include: {
      organization: true,
      postImages: true,
    },
    where: {
      organizationId,
    },
  });
}

export async function retrievePostWithComments(postId: Post["id"]) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      organization: true,
      postImages: true,
      postComments: {
        include: {
          author: true,
        },
      },
    },
  });
}

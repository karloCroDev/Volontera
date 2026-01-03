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
}: PostMangmentArgs & {
  postId: Post["id"];
}) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
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
      author: true,
      postComments: {
        include: {
          author: true,
        },
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

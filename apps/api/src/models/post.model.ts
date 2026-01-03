// Database
import { Post, prisma, User } from "@repo/database";

export async function createPost({
  title,
  content,
  images,
  userId,
}: {
  title: Post["title"];
  content: Post["content"];
  images: string[];
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: userId },
      },
      postImages: {
        create: images.map((imageUrl) => ({ imageUrl })),
      },
    },
  });
}

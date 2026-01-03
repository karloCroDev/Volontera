// Models
import { createUploadUrl } from "@/lib/aws-s3-functions";
import { createPost } from "@/models/post.model";

// Database
import { User } from "@repo/database";

// Schemas
import { createPostSchema } from "@repo/schemas/post";

export async function createPostService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = createPostSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "Invalid post data",
      },
    };
  }

  // TODO: If I am reusing this then make a function
  const uploadImages = await Promise.all(
    data.images.map((image) => createUploadUrl(image))
  );

  const post = await createPost({
    title: data.title,
    content: data.content,
    images: uploadImages.map((img) => img.key),
    userId,
  });

  return {
    status: 200,
    body: {
      title: "Successfuly created post",
      message: "Post created successfully",
      presignedUrls: uploadImages.map((img) => img.url),
      post,
    },
  };
}

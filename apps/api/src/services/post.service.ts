// Models
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import {
  checkIfUserLiked,
  createPost,
  deletePost,
  dislikePost,
  likePost,
  retrieveOrganizationPosts,
  retrievePostData,
  retrievePostWithComments,
  updatePost,
} from "@/models/post.model";

// Database
import { User } from "@repo/database";

// Schema types
import { RetrievePostCommentsArgs } from "@repo/schemas/comment";
import {
  CreatePostArgs,
  DeletePostArgs,
  LikeOrDislikePostArgs,
  RetrieveOrganizationPostsArgs,
  RetrievePostArgs,
  UpdatePostArgs,
} from "@repo/schemas/post";

// Organization admins only
export async function createPostService({
  data,
  userId,
}: {
  data: CreatePostArgs;
  userId: User["id"];
}) {
  // TODO: If I am reusing this then make a function
  const uploadImages = await Promise.all(
    data.images.map((image) => createUploadUrl(image))
  );

  const post = await createPost({
    title: data.title,
    content: data.content,
    images: uploadImages.map((img) => img.key),
    userId,
    organizationId: data.organizationId,
  });

  return toastResponseOutput({
    status: 200,
    message: "Post created successfully",
    title: "Successfuly created post",
    data: { presignedUrls: uploadImages.map((img) => img.url) },
  });
}

export async function deletePostService(data: DeletePostArgs) {
  await deletePost(data.postId);

  return toastResponseOutput({
    status: 200,
    message: "Post deleted successfully",
    title: "Post Deleted",
  });
}

export async function retrievePostDataService({ postId }: RetrievePostArgs) {
  const post = await retrievePostData(postId);

  return toastResponseOutput({
    status: 200,
    message: "Post data retrieved successfully",
    title: "Post Data Retrieved",
    data: { post },
  });
}

export async function updatePostService(data: UpdatePostArgs) {
  let presignedUrls: string[] = [];
  const images = await Promise.all(
    data.images.map(async (img) => {
      if (typeof img === "string") {
        return img;
      }

      const image = await createUploadUrl(img);

      presignedUrls.push(image.url);
      return image.key;
    })
  );

  console.log(data);
  // Maybe return if I want to see it immediately!
  await updatePost({
    postId: data.postId,
    title: data.title,
    content: data.content,
    images,
  });

  return toastResponseOutput({
    status: 200,
    message: "Post updated successfully",
    title: "Successfuly updated post",
    data: { presignedUrls },
  });
}

// Everyone
export async function retrieveOrganizationPostsService({
  data,
  userId,
}: {
  data: RetrieveOrganizationPostsArgs;
  userId: string;
}) {
  const posts = await retrieveOrganizationPosts({
    organizationId: data.organizationId,
    userId,
  });

  return serverFetchOutput({
    message: "Posts retrieved successfully",
    status: 200,
    success: true,
    data: { posts },
  });
}

export async function retrievePostWithCommentsService({
  data,
  userId,
}: {
  data: RetrievePostCommentsArgs;
  userId: string;
}) {
  const post = await retrievePostWithComments({
    postId: data.postId,
    userId,
  });

  return serverFetchOutput({
    status: 200,
    message: "Post with comments retrieved successfully",
    success: true,
    data: { post },
  });
}

export async function toggleLikePostService({
  data,
  userId,
}: {
  data: LikeOrDislikePostArgs;
  userId: User["id"];
}) {
  const userLiked = await checkIfUserLiked({
    postId: data.postId,
    userId,
  });

  if (userLiked) {
    await dislikePost({
      postId: data.postId,
      userId,
    });
  } else {
    await likePost({
      postId: data.postId,
      userId,
    });
  }

  return toastResponseOutput({
    status: 200,
    message: userLiked
      ? "Post disliked successfully"
      : "Post liked successfully",
    title: userLiked ? "Post Disliked" : "Post Liked",
  });
}

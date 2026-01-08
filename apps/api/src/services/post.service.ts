// Models
import { createUploadUrl } from "@/lib/aws-s3-functions";
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
import { RetrievePostCommentsArgs } from "@repo/schemas/comment";

// Schemas
import {
  CreatePostArgs,
  createPostSchema,
  DeletePostArgs,
  deletePostSchema,
  LikeOrDislikePostArgs,
  likeOrDislikePostSchema,
  RetrieveOrganizationPostsArgs,
  retrieveOrganizationPostsSchema,
  retrievePost,
  RetrievePostArgs,
  UpdatePostArgs,
  updatePostSchema,
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

  await createPost({
    title: data.title,
    content: data.content,
    images: uploadImages.map((img) => img.key),
    userId,
    organizationId: data.organizationId,
  });

  return {
    status: 200,
    body: {
      title: "Successfuly created post",
      message: "Post created successfully",
      presignedUrls: uploadImages.map((img) => img.url),
    },
  };
}

export async function deletePostService(data: DeletePostArgs) {
  await deletePost(data.postId);

  return {
    status: 200,
    body: {
      title: "Post Deleted",
      message: "Post deleted successfully",
    },
  };
}

export async function retrievePostDataService({ postId }: RetrievePostArgs) {
  const post = await retrievePostData(postId);

  return {
    status: 200,
    body: {
      message: "Post data retrieved successfully",
      success: true,
      post,
    },
  };
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

  return {
    status: 200,
    body: {
      title: "Successfuly updated post",
      message: "Post updated successfully",
      presignedUrls,
    },
  };
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

  return {
    status: 200,
    body: {
      message: "Posts retrieved successfully",
      success: true,
      posts,
    },
  };
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

  return {
    status: 200,
    body: {
      message: "Post with comments retrieved successfully",
      success: true,
      post,
    },
  };
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

  return {
    status: 200,
    body: {
      title: "Post Liked",
      message: "Post liked successfully",
    },
  };
}

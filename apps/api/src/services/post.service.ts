// Models
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
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

// Schemas
import {
  createPostSchema,
  deletePostSchema,
  likeOrDislikePostSchema,
  retrieveOrganizationPostsSchema,
  retrievePost,
  updatePostSchema,
} from "@repo/schemas/post";

// Organization admins only
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

export async function deletePostService(rawData: string) {
  const { success, data } = deletePostSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid Data",
        message: "Invalid delete post data",
      },
    };
  }

  await deletePost(data.postId);

  return {
    status: 200,
    body: {
      title: "Post Deleted",
      message: "Post deleted successfully",
    },
  };
}

export async function retrievePostDataService(rawData: unknown) {
  const { success, data } = retrievePost.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
        success: false,
      },
    };
  }

  const post = await retrievePostData(data.postId);

  return {
    status: 200,
    body: {
      message: "Post data retrieved successfully",
      success: true,
      post,
    },
  };
}

// I need to handle the ordeing of the images and upload as well
export async function updatePostService(rawData: unknown) {
  const { success, data } = updatePostSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "Invalid post data",
      },
    };
  }

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

  // Maybe return if I want to see it immediately!
  const post = await updatePost({
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
export async function retrieveOrganizationPostsService(rawData: unknown) {
  const { success, data } = retrieveOrganizationPostsSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
        success: false,
      },
    };
  }

  const posts = await retrieveOrganizationPosts(data.organizationId);

  return {
    status: 200,
    body: {
      message: "Posts retrieved successfully",
      success: true,
      posts,
    },
  };
}

export async function retrievePostWithCommentsService(rawData: unknown) {
  const { success, data } = retrievePost.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
        success: false,
      },
    };
  }
  const post = await retrievePostWithComments(data.postId);

  return {
    status: 200,
    body: {
      message: "Post with comments retrieved successfully",
      success: true,
      post,
    },
  };
}

export async function likePostService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = likeOrDislikePostSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid Data",
        message: "The provided data is invalid",
      },
    };
  }

  await likePost({
    postId: data.postId,
    userId,
  });

  return {
    status: 200,
    body: {
      title: "Post Liked",
      message: "Post liked successfully",
    },
  };
}

export async function dislikePostService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = likeOrDislikePostSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid Data",
        message: "The provided data is invalid",
      },
    };
  }

  await dislikePost({
    postId: data.postId,
    userId,
  });

  return {
    status: 200,
    body: {
      title: "Post Disliked",
      message: "Post disliked successfully",
    },
  };
}

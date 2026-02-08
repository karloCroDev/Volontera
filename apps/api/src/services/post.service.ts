// Models
import { calculatePostRankingScore } from "@/lib/utils/algorithm-formula";
import { createUploadUrl } from "@/lib/aws-s3-functions";
import { getOrganizationDetailsById } from "@/models/organization.model";
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

// Services

// Lib
import { isOrganizationOwnerOnProPlan, isUserOnProPlan } from "@/lib/payment";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Database
import { User } from "@repo/database";

// Schemas
import { RetrievePostCommentsArgs } from "@repo/schemas/comment";
import {
  CreatePostArgs,
  DeletePostArgs,
  LikeOrDislikePostArgs,
  RetrieveOrganizationPostsRequestArgs,
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
  const uploadImages = await Promise.all(
    data.images.map((image) => createUploadUrl(image)),
  );

  const [isOrganizationOwnerPro, isAuthorPro, retrieveOrganization] =
    await Promise.all([
      isOrganizationOwnerOnProPlan(data.organizationId),
      isUserOnProPlan(userId),
      getOrganizationDetailsById({
        organizationId: data.organizationId,
        userId,
      }),
    ]);

  // Odmah na početku računam vrijednost posta kako ne bi odmah pao na dno ljestvice
  const rankingScore = calculatePostRankingScore({
    likes: 0,
    comments: 0,
    createdAt: new Date(),
    images: uploadImages.length,
    orgFollowers:
      retrieveOrganization?.organization._count.organizationFollowers || 0,
    isAuthorPro: isAuthorPro,
    isOrgPro: isOrganizationOwnerPro,
  });

  await createPost({
    title: data.title,
    content: data.content,
    images: uploadImages.map((img) => img.key),
    userId,
    organizationId: data.organizationId,
    rankingScore,
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
    }),
  );

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
  data: RetrieveOrganizationPostsRequestArgs;
  userId: string;
}) {
  const posts = await retrieveOrganizationPosts({
    organizationId: data.organizationId,
    userId,
    filter: data.filter,
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

// Database
import { User } from "@repo/database";

// Models
import {
  checkIfUserLikedComment,
  checkIfUserLikedReply,
  createComment,
  deleteComment,
  dislikeComment,
  dislikeReply,
  likeComment,
  likeReply,
  createReply,
  deleteReply,
  retrieveCommentReplies,
  retrievePostComments,
} from "@/models/comment.model";

// Schemas
import {
  createCommentSchema,
  createReplySchema,
  deleteCommentSchema,
  likeOrDislikeCommentSchema,
  likeOrDislikeReplySchema,
  deleteReplySchema,
  retrieveCommentRepliesSchema,
  retrievePostCommentsSchema,
  CreateCommentArgs,
  CreateReplyArgs,
  DeleteCommentArgs,
  DeleteReplyArgs,
  LikeOrDislikeCommentArgs,
  LikeOrDislikeReplyArgs,
  RetrieveCommentRepliesArgs,
  RetrievePostCommentsArgs,
} from "@repo/schemas/comment";

export async function retrievePostCommentsService({
  data,
  userId,
}: {
  data: RetrievePostCommentsArgs;
  userId: User["id"];
}) {
  const comments = await retrievePostComments({
    postId: data.postId,
    userId,
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Comments retrieved successfully",
      comments,
    },
  };
}

export async function createCommentService({
  userId,
  data,
}: {
  data: CreateCommentArgs;
  userId: User["id"];
}) {
  await createComment({
    postId: data.postId,
    userId,
    content: data.content,
  });

  return {
    status: 200,
    body: {
      title: "Comment Created",
      message: "Comment created successfully",
    },
  };
}

// TODO: Add user id to this model
export async function deleteCommentService({
  data,
  userId,
}: {
  data: DeleteCommentArgs;
  userId: User["id"];
}) {
  await deleteComment({
    commentId: data.commentId,
    userId,
  });
  return {
    status: 200,
    body: {
      title: "Comment Deleted",
      message: "Comment deleted successfully",
    },
  };
}

export async function toggleLikeCommentService({
  data,
  userId,
}: {
  data: LikeOrDislikeCommentArgs;
  userId: User["id"];
}) {
  const userLiked = await checkIfUserLikedComment({
    commentId: data.commentId,
    userId,
  });

  if (userLiked) {
    await dislikeComment({
      commentId: data.commentId,
      userId,
    });
  } else {
    await likeComment({
      commentId: data.commentId,
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

export async function retrieveCommentRepliesService({
  userId,
  data,
}: {
  data: RetrieveCommentRepliesArgs;
  userId: User["id"];
}) {
  const replies = await retrieveCommentReplies({
    commentId: data.commentId,
    userId,
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Replies retrieved successfully",
      replies,
    },
  };
}

export async function createReplyService({
  data,
  userId,
}: {
  data: CreateReplyArgs;
  userId: User["id"];
}) {
  await createReply({
    commentId: data.commentId,
    userId,
    content: data.content,
  });

  return {
    status: 201,
    body: {
      title: "Reply Created",
      message: "Reply created successfully",
    },
  };
}

export async function deleteReplyService({
  data,
  userId,
}: {
  data: DeleteReplyArgs;
  userId: User["id"];
}) {
  await deleteReply({
    replyId: data.replyId,
    userId,
  });
  return {
    status: 200,
    body: {
      title: "Reply Deleted",
      message: "Reply deleted successfully",
    },
  };
}

export async function toggleLikeReplyService({
  data,
  userId,
}: {
  data: LikeOrDislikeReplyArgs;
  userId: User["id"];
}) {
  const userLiked = await checkIfUserLikedReply({
    replyId: data.replyId,
    userId,
  });

  if (userLiked) {
    await dislikeReply({
      replyId: data.replyId,
      userId,
    });
  } else {
    await likeReply({
      replyId: data.replyId,
      userId,
    });
  }
  return {
    status: 200,
    body: {
      title: "Reply Liked",
      message: "Reply liked successfully",
    },
  };
}

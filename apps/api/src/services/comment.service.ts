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
} from "@repo/schemas/comment";

export async function retrievePostCommentsService({
  rawData,
}: {
  rawData: unknown;
}) {
  const { success, data } = retrievePostCommentsSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        success: false,
        message: "The provided data comment data is invalid",
      },
    };
  }

  const comments = await retrievePostComments(data.postId);

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
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = createCommentSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data",
        message: "The provided data is invalid.",
      },
    };
  }

  await createComment({
    postId: data.postId,
    userId,
    content: data.content,
  });

  return {
    status: 201,
    body: {
      title: "Comment Created",
      message: "Comment created successfully",
    },
  };
}

export async function deleteCommentService({ rawData }: { rawData: unknown }) {
  const { success, data } = deleteCommentSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data",
        message: "The provided data is invalid.",
      },
    };
  }
  await deleteComment(data.commentId);
  return {
    status: 200,
    body: {
      title: "Comment Deleted",
      message: "Comment deleted successfully",
    },
  };
}

export async function toggleLikeCommentService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = likeOrDislikeCommentSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid Data",
        message: "The provided data is invalid",
      },
    };
  }

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
  rawData,
}: {
  rawData: unknown;
}) {
  const { success, data } = retrieveCommentRepliesSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        success: false,
        message: "The provided data is invalid",
      },
    };
  }

  const replies = await retrieveCommentReplies(data.commentId);

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
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = createReplySchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data",
        message: "The provided data is invalid.",
      },
    };
  }

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

export async function deleteReplyService({ rawData }: { rawData: unknown }) {
  const { success, data } = deleteReplySchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data",
        message: "The provided data is invalid.",
      },
    };
  }
  await deleteReply(data.replyId);
  return {
    status: 200,
    body: {
      title: "Reply Deleted",
      message: "Reply deleted successfully",
    },
  };
}

export async function toggleLikeReplyService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = likeOrDislikeReplySchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid Data",
        message: "The provided data is invalid",
      },
    };
  }
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

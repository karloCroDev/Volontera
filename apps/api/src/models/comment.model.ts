// Database
import {
  Post,
  prisma,
  User,
  PostComments,
  PostCommentsReply,
} from "@repo/database";

// Comments
export async function retrievePostComments({
  postId,
  userId,
}: {
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.postComments.findMany({
    where: {
      postId,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      postCommentsLikes: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          postCommentsLikes: true,
          postCommentsReplies: true,
        },
      },
    },
  });
}

export async function createComment({
  content,
  postId,
  userId,
}: {
  content: string;
  postId: Post["id"];
  userId: User["id"];
}) {
  return prisma.postComments.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
  });
}

export async function deleteComment(commentId: PostComments["id"]) {
  return prisma.postComments.delete({
    where: {
      id: commentId,
    },
  });
}

// Liking the comments
export async function checkIfUserLikedComment({
  commentId,
  userId,
}: {
  commentId: PostComments["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsLikes.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });
}

export async function likeComment({
  commentId,
  userId,
}: {
  commentId: PostComments["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsLikes.create({
    data: {
      commentId,
      userId,
    },
  });
}

export async function dislikeComment({
  commentId,
  userId,
}: {
  commentId: PostComments["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsLikes.delete({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });
}

// Replies
export async function retrieveCommentReplies({
  commentId,
  userId,
}: {
  commentId: PostComments["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsReply.findMany({
    where: {
      commentId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      postCommentsReplyLikes: {
        where: {
          userId,
        },
      },
      // _count: {
      //   select: {
      //     postCommentsReplyLikes: true,
      //   },
      // },
      // TODO: See if I am going to handle likes for replies
    },
  });
}

export async function createReply({
  content,
  commentId,
  userId,
}: {
  content: string;
  commentId: PostComments["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsReply.create({
    data: {
      content,
      commentId,
      authorId: userId,
    },
  });
}

export async function deleteReply(replyId: PostCommentsReply["id"]) {
  return prisma.postCommentsReply.delete({
    where: {
      id: replyId,
    },
  });
}

export async function checkIfUserLikedReply({
  replyId,
  userId,
}: {
  replyId: PostCommentsReply["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsReplyLikes.findUnique({
    where: {
      replyId_userId: {
        replyId,
        userId,
      },
    },
  });
}

export async function likeReply({
  replyId,
  userId,
}: {
  replyId: PostCommentsReply["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsReplyLikes.create({
    data: {
      replyId,
      userId,
    },
  });
}

export async function dislikeReply({
  replyId,
  userId,
}: {
  replyId: PostCommentsReply["id"];
  userId: User["id"];
}) {
  return prisma.postCommentsReplyLikes.delete({
    where: {
      replyId_userId: {
        replyId,
        userId,
      },
    },
  });
}

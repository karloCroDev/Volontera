// External packages
import { Request, Response } from "express";

// Services
import {
  createCommentService,
  createReplyService,
  deleteCommentService,
  deleteReplyService,
  retrieveCommentRepliesService,
  retrievePostCommentsService,
  toggleLikeCommentService,
  toggleLikeReplyService,
} from "@/services/comment.service";

// Schemas
import {
  DeleteCommentArgs,
  DeleteReplyArgs,
  LikeOrDislikeCommentArgs,
  LikeOrDislikeReplyArgs,
  RetrieveCommentRepliesArgs,
  RetrievePostCommentsArgs,
} from "@repo/schemas/comment";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function retrievePostCommentsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrievePostCommentsService({
      data: req.params as RetrievePostCommentsArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createCommentController(req: Request, res: Response) {
  try {
    const result = await createCommentService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteCommentController(req: Request, res: Response) {
  try {
    const result = await deleteCommentService({
      data: req.params as DeleteCommentArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function toggleLikeCommentController(req: Request, res: Response) {
  try {
    const result = await toggleLikeCommentService({
      data: req.params as LikeOrDislikeCommentArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// Replies

export async function createReplyController(req: Request, res: Response) {
  try {
    const result = await createReplyService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteReplyController(req: Request, res: Response) {
  try {
    const result = await deleteReplyService({
      data: req.params as DeleteReplyArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function toggleLikeReplyController(req: Request, res: Response) {
  try {
    const result = await toggleLikeReplyService({
      data: req.params as LikeOrDislikeReplyArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveCommentRepliesController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveCommentRepliesService({
      data: req.params as RetrieveCommentRepliesArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

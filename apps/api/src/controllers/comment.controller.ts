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
import { retrieveCommentReplies } from "@/models/comment.model";

export async function retrievePostCommentsController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrievePostCommentsService({
      rawData: req.params,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function createCommentController(req: Request, res: Response) {
  try {
    const result = await createCommentService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function deleteCommentController(req: Request, res: Response) {
  try {
    const result = await deleteCommentService({
      rawData: req.params,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function toggleLikeCommentController(req: Request, res: Response) {
  try {
    const result = await toggleLikeCommentService({
      rawData: req.params,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

// Replies

export async function createReplyController(req: Request, res: Response) {
  try {
    const result = await createReplyService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function deleteReplyController(req: Request, res: Response) {
  try {
    const result = await deleteReplyService({
      rawData: req.params,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function toggleLikeReplyController(req: Request, res: Response) {
  try {
    const result = await toggleLikeReplyService({
      rawData: req.body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function retrieveCommentRepliesController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveCommentRepliesService({
      rawData: req.params,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

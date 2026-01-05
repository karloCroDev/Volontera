// External packages
import { Request, Response } from "express";

// Services
import {
  createCommentService,
  createReplyService,
  deleteCommentService,
  deleteReplyService,
  toggleLikeCommentService,
  toggleLikeReplyService,
} from "@/services/comment.service";

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
    const result = await deleteCommentService(req.body);

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function toggleLikeCommentController(req: Request, res: Response) {
  try {
    const result = await toggleLikeCommentService({
      rawData: req.body,
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
    const result = await deleteReplyService(req.body);

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

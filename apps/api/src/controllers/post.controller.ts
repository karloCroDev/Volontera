// External packages
import { Request, Response } from "express";

// Services
import { createPostService } from "@/services/post.service";

export async function createPostController(req: Request, res: Response) {
  try {
    const result = await createPostService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

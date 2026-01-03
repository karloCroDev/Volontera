// External packages
import { Request, Response } from "express";

// Services
import {
  createPostService,
  deletePostService,
  dislikePostService,
  likePostService,
  retrieveOrganizationPostsService,
  retrievePostWithCommentsService,
} from "@/services/post.service";

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

export async function deletePostController(req: Request, res: Response) {
  try {
    const result = await deletePostService(req.body);

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

// export async function updatePostSchema(req: Request, res: Response) {
//   try {
//     const result = await up({
//       rawData: req.body,
//       userId: req.user.userId,
//     });

//     return res.status(result.status).json(result.body);
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Internal error" });
//   }
// }

// Everyone
export async function retrieveOrganizationPostsController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrieveOrganizationPostsService(req.params);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function retrievePostWithCommentsController(
  req: Request,
  res: Response
) {
  try {
    const result = await retrievePostWithCommentsService(req.params);

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function likePostController(req: Request, res: Response) {
  try {
    const result = await likePostService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

export async function dislikePostController(req: Request, res: Response) {
  try {
    const result = await dislikePostService({
      rawData: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

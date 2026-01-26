// External packages
import { Request, Response } from "express";

// Services
import {
  createPostService,
  deletePostService,
  toggleLikePostService,
  retrieveOrganizationPostsService,
  retrievePostDataService,
  retrievePostWithCommentsService,
  updatePostService,
} from "@/services/post.service";

// Schema types
import {
  RetrieveOrganizationPostsArgs,
  retrieveOrganizationPostsQuerySchema,
  RetrieveOrganizationPostsRequestArgs,
  RetrievePostArgs,
} from "@repo/schemas/post";
import { RetrievePostCommentsArgs } from "@repo/schemas/comment";
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function createPostController(req: Request, res: Response) {
  try {
    const result = await createPostService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deletePostController(req: Request, res: Response) {
  try {
    console.log(req.body);
    const result = await deletePostService(req.body);

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function updatePostController(req: Request, res: Response) {
  try {
    const result = await updatePostService(req.body);

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrievePostDataController(req: Request, res: Response) {
  try {
    const result = await retrievePostDataService(
      req.params as RetrievePostArgs,
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal error" });
  }
}

// Everyone
export async function retrieveOrganizationPostsController(
  req: Request,
  res: Response,
) {
  try {
    const query = retrieveOrganizationPostsQuerySchema.parse(req.query);
    const result = await retrieveOrganizationPostsService({
      data: {
        ...(req.params as RetrieveOrganizationPostsArgs),
        ...query,
      } as RetrieveOrganizationPostsRequestArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrievePostWithCommentsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrievePostWithCommentsService({
      data: req.params as RetrievePostCommentsArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function toggleLikePostController(req: Request, res: Response) {
  try {
    const result = await toggleLikePostService({
      data: req.body,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// External packages
import { Request, Response } from "express";

// Services
import {
  retrieveRecentAlgoPostsService,
  retrieveRecentFollowedAlgoPostsService,
} from "@/services/home.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";
import {
  retrieveAlgoPostsSchema,
  retrieveFollowedAlgoPostsSchema,
} from "@repo/schemas/home";

export async function retrieveRecentAlgoPostsController(
  req: Request,
  res: Response
) {
  try {
    const data = retrieveAlgoPostsSchema.parse(req.query);

    const result = await retrieveRecentAlgoPostsService({
      userId: req.user.userId,
      data,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveRecentFollowedAlgoPostsController(
  req: Request,
  res: Response
) {
  try {
    const data = retrieveFollowedAlgoPostsSchema.parse(req.query);

    const result = await retrieveRecentFollowedAlgoPostsService({
      userId: req.user.userId,
      data,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

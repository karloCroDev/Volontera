// External packages
import { Request, Response } from "express";

// Services
import { searchUsersService } from "@/services/search.service";

// Schema types
import { SearchUserArgs } from "@repo/schemas/search";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function searchUsersController(req: Request, res: Response) {
  try {
    const result = await searchUsersService({
      data: req.params as SearchUserArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// External packages
import { Request, Response } from "express";

// Services
import { searchUsersService } from "@/services/search.service";
import { SearchUserArgs } from "@repo/schemas/search";

export async function searchUsersController(req: Request, res: Response) {
  try {
    const result = await searchUsersService({
      data: req.params as SearchUserArgs,
      userId: req.user.userId,
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

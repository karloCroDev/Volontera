// External packages
import { Request, Response } from "express";

// Services
import { retrieveRecentAlgoPostsService } from "@/services/home.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";
import {
  retrieveAlgoPostsSchema,
  RetrieveAlgoPostsSchemaArgs,
} from "@repo/schemas/home";

export async function retrieveRecentAlgoPostsController(
  req: Request,
  res: Response,
) {
  const data = retrieveAlgoPostsSchema.parse(req.query); // Drugi put pozivam ovo isto, jer dobivam podatke iz querija tj. brojevi su stringovi
  try {
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

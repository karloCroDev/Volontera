// External packages
import { Request, Response } from "express";

// Services
import {
  getUserByIdService,
  retrieveAllOrganizationsForUserService,
  retrieveAllPostsForUserService,
} from "@/services/user.service";
import { handleServerErrorResponse } from "@/lib/utils/error-response";
import { UserSchemaArgs } from "@repo/schemas/user";

export async function userSessionController(req: Request, res: Response) {
  try {
    const result = await getUserByIdService({
      userId: req.user.userId,
    } as UserSchemaArgs);

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    handleServerErrorResponse(res, err);
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    // TODO: For this write a zod schema later
    const result = await getUserByIdService(req.params as UserSchemaArgs);

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveAllOrganizationsForUserController(
  req: Request,
  res: Response
) {
  try {
    // TODO: For this write a zod schema later
    const result = await retrieveAllOrganizationsForUserService(
      req.params as UserSchemaArgs
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveAllPostsForUserController(
  req: Request,
  res: Response
) {
  try {
    // TODO: For this write a zod schema later
    const result = await retrieveAllPostsForUserService(
      req.params as UserSchemaArgs
    );

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

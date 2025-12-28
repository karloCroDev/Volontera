// External packages
import { Request, Response } from "express";

// Services
import { getUserByIdService } from "@/services/user.service";

export async function userSessionController(req: Request, res: Response) {
  try {
    const { userId } = req.user;

    const result = await getUserByIdService(userId);

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    // TODO: For this write a zod schema later
    const result = await getUserByIdService(req.params.userId as string);

    return res.status(result.status).json(result.body);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

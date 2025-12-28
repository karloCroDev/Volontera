// External packages
import { Request, Response } from "express";
import {
  resetPasswordService,
  forgotPasswordService,
  loginService,
  registerService,
  resetVerifyTokenService,
  verifyOtpService,
} from "@/services/auth.service";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { HTTP_STATUS } from "@/lib/utils/http-status-codes";

export async function login(req: Request, res: Response) {
  try {
    const result = await loginService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const result = await registerService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function resetVerifyToken(req: Request, res: Response) {
  try {
    const result = await resetVerifyTokenService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const result = await verifyOtpService(req.body);

    if (result && result.body.user) {
      generateTokenAndSetCookie({
        res,
        userId: result.body.user.id,
        role: result.body.user.role,
        onboardingFinished: result.body.user.onboardingFinished,
      });
      // Prevent sending user data in response (detailed explaination in additionalInformation controller)
      delete (result.body as any).user;
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const result = await resetPasswordService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function forgetPassword(req: Request, res: Response) {
  try {
    const result = await forgotPasswordService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

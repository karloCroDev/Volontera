// External packages
import { Request, Response } from "express";

// Schemas
import type { VerifyEmailArgs } from "@repo/schemas/auth";

// Services
import {
  resetPasswordService,
  forgotPasswordService,
  loginService,
  registerService,
  resetVerifyTokenService,
  verifyOtpService,
  type VerifyOtpServiceResult,
} from "@/services/auth.service";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function loginController(req: Request, res: Response) {
  try {
    const result = await loginService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function registerController(req: Request, res: Response) {
  try {
    const result = await registerService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function resetVerifyTokenController(req: Request, res: Response) {
  try {
    const result = await resetVerifyTokenService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function verifyTokenController(req: Request, res: Response) {
  try {
    const result: VerifyOtpServiceResult = await verifyOtpService(
      req.body as VerifyEmailArgs,
    );

    if ("user" in result.body) {
      const { user, ...bodyWithoutUser } = result.body;

      generateTokenAndSetCookie({
        res,
        userId: user.id,
        role: user.role,
        onboardingFinished: user.onboardingFinished,
      });

      return res.status(result.status).json(bodyWithoutUser);
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const result = await resetPasswordService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function forgetPasswordController(req: Request, res: Response) {
  try {
    const result = await forgotPasswordService(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

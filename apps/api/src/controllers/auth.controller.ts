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

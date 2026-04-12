// External packages
import { Request, Response } from "express";

// Schemas
import { VerifyEmailArgs } from "@repo/schemas/auth";

// Services
import {
  resetPasswordService,
  forgotPasswordService,
  loginService,
  registerService,
  resetVerifyTokenService,
  verifyOtpService,
  VerifyOtpServiceResult,
} from "@/services/auth.service";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import {
  clearOtpChallengeCookie,
  getOtpChallengeEmailFromRequest,
  setOtpChallengeCookie,
} from "@/lib/otp-challenge-cookie";
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function loginController(req: Request, res: Response) {
  try {
    const result = await loginService(req.body);
    if (result.status === 200 && req.body?.email) {
      setOtpChallengeCookie(res, req.body.email);
    }
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function registerController(req: Request, res: Response) {
  try {
    const result = await registerService(req.body);
    if (result.status === 200 && req.body?.email) {
      setOtpChallengeCookie(res, req.body.email);
    }
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function resetVerifyTokenController(req: Request, res: Response) {
  try {
    const email = getOtpChallengeEmailFromRequest(req);
    if (!email) {
      return res.status(400).json({ message: "OTP session expired" });
    }

    const result = await resetVerifyTokenService(email);
    setOtpChallengeCookie(res, email); // Resetiram OTP challenge cookie opet na 10 minuta kako bi matchao sa resultom

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function verifyTokenController(req: Request, res: Response) {
  try {
    const email = getOtpChallengeEmailFromRequest(req);
    if (!email) {
      return res.status(400).json({ message: "OTP session expired" });
    }

    const result: VerifyOtpServiceResult = await verifyOtpService({
      code: (req.body as VerifyEmailArgs).code,
      email,
    });

    if ("user" in result.body) {
      const { user, ...bodyWithoutUser } = result.body;

      generateTokenAndSetCookie({
        res,
        userId: user.id,
        role: user.role,
        onboardingFinished: user.onboardingFinished,
      });

      clearOtpChallengeCookie(res);

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

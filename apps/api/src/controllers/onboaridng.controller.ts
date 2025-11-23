// External packages
import { Request, Response } from "express";

// Services
import { loginService } from "@/services/auth.service";
import {
  additionalInformationService,
  skipAdditionalInformationService,
} from "@/services/onboarding.service";

// Lib
import { HTTP_STATUS } from "@/lib/utils/http-status-codes";
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

export async function appType(req: Request, res: Response) {
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

export async function additionalInformation(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    const result = await additionalInformationService(req.body, userId);

    if (result.body.user) {
      generateTokenAndSetCookie({
        res,
        userId: result.body.user.id,
        role: result.body.user.role,
        onboardingFinished: true,
      });

      // Prevent sending user data in response (for security reasons) --> telling ts to ignore the formatted strucutre of object with user
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

export async function skipAdditionalInformation(req: Request, res: Response) {
  try {
    const result = await skipAdditionalInformationService(req.body);

    if (result.body.user) {
      generateTokenAndSetCookie({
        res,
        userId: result.body.user.id,
        role: result.body.user.role,
        onboardingFinished: true,
      });
      // Prevent sending user data in response
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

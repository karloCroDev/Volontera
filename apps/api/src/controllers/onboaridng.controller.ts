// External packages
import { Request, Response } from "express";

// Services
import {
  additionalInformationService,
  skipAdditionalInformationService,
  appTypeService,
} from "@/services/onboarding.service";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function appType(req: Request, res: Response) {
  try {
    const { userId } = req.user;

    const result = await appTypeService(req.body, userId);

    if (result.body.role) {
      generateTokenAndSetCookie({
        res,
        userId: userId,
        role: result.body.role,
        onboardingFinished: false,
      });
      delete (result.body as any).role;
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function additionalInformation(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await additionalInformationService(req.body, userId);

    if (result.body.user) {
      generateTokenAndSetCookie({
        res,
        userId: userId,
        role: result.body.user.role,
        onboardingFinished: true,
      });

      // Prevent sending user data in response (for security reasons) --> telling ts to ignore the formatted strucutre of object with user
      delete (result.body as any).user;
    }

    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function skipAdditionalInformation(req: Request, res: Response) {
  try {
    const result = await skipAdditionalInformationService(req.user.userId);

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
    handleServerErrorResponse(res, err);
  }
}

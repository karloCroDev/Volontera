// External packages
import { Request, Response } from "express";

// Services
import {
  checkoutService,
  webhookService,
  billingService,
} from "@/services/payment.service";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

export async function stripePayment(req: Request, res: Response) {
  try {
    const sig = req.headers["stripe-signature"];

    if (typeof sig !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Missing signature" });
    }

    const result = await webhookService({
      body: req.body,
      sig,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function stripeCheckout(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await checkoutService({
      userId,
      data: req.query as any,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function billing(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await billingService({ userId });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

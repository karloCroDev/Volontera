// External packages
import { Request, Response } from "express";

// Services
import {
  checkoutService,
  webhookService,
  billingService,
} from "@/services/payment.service";

export async function stripePayment(req: Request, res: Response) {
  try {
    const sig = req.headers["stripe-signature"];

    if (typeof sig !== "string") {
      return res
        .status(402)
        .json({ success: false, message: "Missing signature" });
    }

    const result = await webhookService({
      body: req.body,
      sig,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function stripeCheckout(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await checkoutService({
      userId,
      priceId: req.body,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

export async function billing(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await billingService({ userId });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

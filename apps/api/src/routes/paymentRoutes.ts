// External packages
import { Router } from "express";
import { stripeWebhook } from "@/controllers/stripe-webhook/stripe";
import bodyParser from "body-parser";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/checkout",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

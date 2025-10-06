import express from "express";
import { Router } from "express";
import { stripeWebhook } from "@/src/controllers/stripe-webhook/stripe";
import bodyParser from "body-parser";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/checkout",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

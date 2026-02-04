// External packages
import express from "express";
import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import {
  stripePayment,
  stripeCheckout,
  billing,
} from "@/controllers/payment.controller";

// Middleware
import { authMiddleware } from "@/middleware/auth.middleware";
import { hasRoleMiddleware } from "@/middleware/role.middleware";
import { validate } from "@/middleware/validate.middleware";
import { createCheckoutSessionSchema } from "@repo/schemas/payment";

export const paymentRoutes = Router();

// Stripe webhook needs the raw body and must be before express.json middleware
paymentRoutes.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripePayment,
);

// JSON parsing for all other payment endpoints (must be after webhook)
paymentRoutes.use(express.json());

paymentRoutes.post(
  "/checkout",
  authMiddleware,
  hasRoleMiddleware,
  validate({
    type: "query",
    responseOutput: "toast",
    schema: createCheckoutSessionSchema,
  }),
  stripeCheckout,
);

paymentRoutes.get("/billing", authMiddleware, hasRoleMiddleware, billing);

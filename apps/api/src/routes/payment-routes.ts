// External packages
import express from "express";
import { Router } from "express";
import bodyParser from "body-parser";

// Controllers
import { stripePayment } from "@/controllers/payment.controller";

// Middleware
import { authMiddleware } from "@/middleware/auth-middleware";
import { hasRoleMiddleware } from "@/middleware/role-middleware";

export const paymentRoutes = Router();

// Stripe webhook needs the raw body and must be before express.json middleware
paymentRoutes.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripePayment
);

paymentRoutes.post(
  "/checkout",
  express.json(),
  authMiddleware,
  hasRoleMiddleware
);

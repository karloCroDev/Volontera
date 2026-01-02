// External packages
import express from "express";
import { Router } from "express";

// Controllers

import {
  logoutController,
  getUserByIdController,
  userSessionController,
} from "@/controllers/user.controller";

export const userRoutes = Router();

userRoutes.use(express.json());

userRoutes.get("/id/:userId", getUserByIdController);
userRoutes.get("/session", userSessionController);
userRoutes.post("/logout", logoutController);

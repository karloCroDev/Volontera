// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { helpConversation } from "@/controllers/help.controller";

export const helpRoutes = Router();

helpRoutes.use(express.json());

helpRoutes.patch("/help-conversation", helpConversation);

// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { searchUsersController } from "@/controllers/search.controller";

export const searchRoutes = Router();

searchRoutes.use(express.json());

searchRoutes.get("/:query", searchUsersController);

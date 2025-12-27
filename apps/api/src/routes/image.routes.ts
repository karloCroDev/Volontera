// External packages
import express from "express";
import { Router } from "express";

// Controllers
import { getImageFromKeyController } from "@/controllers/image.controller";

export const imageRoutes = Router();

imageRoutes.use(express.json());

imageRoutes.post("/get-url-from-keys", getImageFromKeyController);

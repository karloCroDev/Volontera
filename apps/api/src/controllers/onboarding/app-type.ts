// External packages
import { Request, Response } from "express";

// Config
import { prisma } from "@/config/prisma";

// Types
import { AppType } from "@repo/types/onboarding";
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";

export async function appType(req: Request, res: Response) {
  const type: AppType = req.body;

  if (type !== "USER" && type !== "ORGANIZATION") {
    return res.status(400).json({ message: "Invalid app type provided" });
  }

  const userRole = await prisma.user.update({
    where: {
      id: req.user.userId,
    },
    data: {
      role: type,
    },
  });

  if (!userRole) {
    return res.status(400).json({
      message:
        "There has been error with choosing the app type (user non existent)",
    });
  }
  console.log(type);

  generateTokenAndSetCookie({
    res,
    userId: userRole.id,
    role: type,
    onboardingFinished: false,
  });

  return res.json({
    title: "App type saved",
    message: "Your app type has been saved successfully",
  });
}

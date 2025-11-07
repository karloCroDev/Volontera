// External packages
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";

export async function session(req: Request, res: Response) {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        subscriptionTier: true,
        subscriptionType: true,
      },
    });

    if (!user)
      return res.status(401).json({
        message: "User is not logged in",
      });

    const image = user.image && (await getImagePresignedUrls(user.image));

    const response = image ? { ...user, image } : { ...user };

    res.status(200).json({ ...response, message: "User is logged in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

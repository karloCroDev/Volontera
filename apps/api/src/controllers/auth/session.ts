// External packages
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";
import { JwtUser } from "@/lib/types/jwt";

export async function session(req: Request, res: Response) {
  try {
    const header = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token = null;

    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token)
      return res
        .status(401)
        .json({ message: "Not authenticated", success: false });

    // console.log(!token);
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtUser;
    console.log(payload);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullname: true,
        email: true,
        bio: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        subscriptionTier: true,
        onboardingFinished: true,
        subscriptionType: true,
      },
    });

    if (!user)
      return res.status(401).json({
        success: false,
        message: "User is not logged in",
      });

    const image = user.image && (await getImagePresignedUrls(user.image));

    const response = image ? { ...user, image } : { ...user };

    res
      .status(200)
      .json({ ...response, message: "User is logged in", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

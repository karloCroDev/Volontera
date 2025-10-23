// External packages
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { verifyUser } from "@/lib/verify-user";

// Schemas
import { verifyEmail } from "@repo/schemas/auth";

export async function verifyTokenOtp(req: Request, res: Response) {
  const data = req.body;

  const { data: validateData, success } = verifyEmail.safeParse(data);

  if (!success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validateData.email,
      verificationTokenExpiresAt: {
        gt: Date.now(),
      },
    },
  });

  if (!user || !user.verificationToken) {
    return res.status(400).json({ message: "Invalid code" });
  }

  const isValidOtp = await bcrypt.compare(
    validateData.code,
    user.verificationToken
  );

  if (!isValidOtp) {
    return res.status(400).json({ message: "Invalid code" });
  }

  const userUpdated = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });

  if (!userUpdated) {
    return res.status(200).json({
      message: "User verified successfully",
      success: false,
    });
  }

  generateTokenAndSetCookie({
    res,
    userId: user.id,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
  });

  return res.status(200).json({
    message: "User is verified successfully",
  });
}

export async function resetVerifyToken(req: Request, res: Response) {
  const data = req.body;

  const { data: validateData, success } = verifyEmail.safeParse(data);

  console.log(validateData);
  if (!success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const {
    success: successResend,
    hashedOtp,
    message,
    expireDate,
  } = await verifyUser(validateData.email);

  if (!successResend) {
    return res.status(400).json({
      message: message,
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: validateData.email,
      verificationToken: validateData.code, // Don't check for expiration, because I am reseting with the new code
    },
    data: {
      verificationToken: hashedOtp,
      verificationTokenExpiresAt: expireDate,
    },
  });

  if (!updatedUser) {
    return res.status(400).json({ message: "Error with email" });
  }
  return res.status(200).json({
    message: "User logged in successfully",
  });
}

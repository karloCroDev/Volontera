// External packages
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Lib
import { zodErrorDetecter } from "@/lib/utils/zodDetectionError";
import { verifyUser } from "@/lib/verify-user";

// Config
import { prisma } from "@/config/prisma";

// Schemas
import { LoginArgs, loginSchema } from "@repo/schemas/auth";

export async function login(req: Request, res: Response) {
  try {
    const data: LoginArgs = req.body;
    const { data: validateData, success: loginSuccess } =
      loginSchema.safeParse(data);

    if (!loginSuccess) {
      return res.status(400).json({
        message: "Provided data is incorrect",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: validateData.email,
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid email" });

    const passwordIsValid = bcrypt.compareSync(
      validateData.password,
      user.password
    );

    if (!passwordIsValid)
      return res.status(400).json({ message: "Invalid password" });

    const {
      //  success,
      hashedOtp,
      //  message,
      expireDate,
    } = await verifyUser(validateData.email);

    // if (!success) {
    //   return res.status(400).json({
    //     message: message,
    //   });
    // }

    const updatedUser = await prisma.user.update({
      where: {
        email: validateData.email,
      },
      data: {
        verificationToken: hashedOtp,
        verificationTokenExpiresAt: expireDate, // 1 hour
      },
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "Error with email" });
    }
    return res.status(200).json({
      title: "Success",
      message: "Checkout your email inbox for verification code",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

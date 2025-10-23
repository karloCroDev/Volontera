// External packages
import { Request, Response } from "express";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { zodErrorDetecter } from "@/lib/zodDetectionError";

// Schemas
import { registerSchema } from "@repo/schemas/auth";
import bcrypt from "bcrypt";
import { verifyUser } from "@/lib/verify-user";

export async function register(req: Request, res: Response) {
  try {
    const data = req.body;

    const {
      data: validateData,
      success,
      error,
    } = registerSchema.safeParse(data);

    if (!success) {
      return res.json({
        errors: zodErrorDetecter(error),
      });
    }

    const hashedPassword = bcrypt.hashSync(validateData.password, 10);

    const {
      success: verifySuccess,
      hashedOtp,
      message,
      expireDate,
    } = await verifyUser(validateData.email); // Sending email before checking if user exists, not ideal, I would send email after creating user in db, so refacotring this function might not be a bad idea!

    if (!verifySuccess) {
      return res.status(400).json({
        message: message,
      });
    }

    const user = await prisma.user.create({
      data: {
        firstName: validateData.firstName,
        lastName: validateData.lastName,
        email: validateData.email,
        password: hashedPassword,
        verificationToken: hashedOtp,
        verificationTokenExpiresAt: expireDate,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Already existing user, please login!",
      });
    }

    return res.json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

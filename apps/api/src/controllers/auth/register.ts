import { Request, Response } from "express";
import { registerSchema, RegisterArgs } from "@repo/schemas";
import { zodErrorDetecter } from "@/src/lib/zodDetectionError";
import bcrypt from "bcrypt";
import { prisma } from "@/src/config/prisma";
import { verifyUser } from "@/src/lib/verify-user";

export async function register(req: Request, res: Response) {
  try {
    const data: RegisterArgs = req.body;

    const validateData = registerSchema.safeParse(data);

    if (!validateData.success) {
      return res.json({
        errors: zodErrorDetecter(validateData.error),
      });
    }

    const hashedPassword = bcrypt.hashSync(validateData.data.password, 10);

    console.log(validateData.data.email);
    const { success, hashedOtp, message, expireDate } = await verifyUser(
      validateData.data.email
    ); // Sending email before checking if user exists, not ideal, I would send email after creating user in db, so refacotring this function might not be a bad idea!

    if (!success) {
      return res.status(400).json({
        message: message,
        success: false,
      });
    }

    const user = await prisma.user.create({
      data: {
        username: validateData.data.username,
        email: validateData.data.email,
        password: hashedPassword,
        verificationToken: hashedOtp,
        verificationTokenExpiresAt: expireDate,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Already existing user, please login!",
        success: false,
      });
    }

    return res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
}

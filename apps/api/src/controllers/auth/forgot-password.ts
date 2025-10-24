// External packages
import crypto from "crypto";
import { Request, Response } from "express";

// Config
import { resend } from "@/config/resend";
import { prisma } from "@/config/prisma";
import { sendEmail } from "@/config/nodemailer";

// Schemas
import { forgotPasswordSchema } from "@repo/schemas/auth";

export async function forgotPassword(req: Request, res: Response) {
  const reqData = req.body;

  const { success, data: validatedData } =
    forgotPasswordSchema.safeParse(reqData);

  if (!success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpireDate = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  const user = await prisma.user.update({
    where: {
      email: validatedData.email,
    },
    data: {
      resetToken,
      resetTokenExpireDate,
    },
  }); // TODO: saznaj kako handleati errore s prismom

  if (!user) return res.status(400).json({ message: "Invalid email" });

  if (process.env.NODE_ENV === "production") {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: validatedData.email,
      subject: "Reset your password",
      html: `<p>http://localhost:3000/auth/forgot-password/reset-password?token=${resetToken}</p>`, // Karlo dodaj shared components i dodaj react email i ondaj dodaj mail
    });

    if (error) {
      return res.status(400).json({ message: "Error with email" });
    }
  } else {
    await sendEmail({
      html: `<p>http://localhost:3000/auth/forgot-password/reset-password?token=${resetToken}</p>`,
      subject: "Reset your password",
      to: validatedData.email,
    });
  }

  res.status(200).json({ message: "Email sent" });
}

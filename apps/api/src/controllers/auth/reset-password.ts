// External packages
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Schemas
import { resetPasswordSchema } from "@repo/schemas/auth";

// Config
import { prisma } from "@/config/prisma";

export async function resetPassword(req: Request, res: Response) {
  const reqData = req.body;

  const { success, data: validatedData } =
    resetPasswordSchema.safeParse(reqData);

  if (!success) {
    return res.status(400).json({ message: "Invalid data", success: true });
  }

  const hashedPassword = bcrypt.hashSync(validatedData.password, 10);

  const user = await prisma.user.update({
    where: {
      resetToken: validatedData.token,
      resetTokenExpireDate: {
        gt: Date.now(),
      },
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpireDate: null,
    },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid token", success: true });

  res
    .status(200)
    .json({ message: "Your password is successfuly updated!", success: true });
}

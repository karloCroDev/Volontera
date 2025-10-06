import { resetPasswordSchema } from "@repo/schemas";
import { Request, Response } from "express";
import { prisma } from "@/src/config/prisma";
import bcrypt from "bcrypt";

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

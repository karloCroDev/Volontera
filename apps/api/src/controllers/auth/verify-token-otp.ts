// External packages
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Config
import { prisma } from "@/config/prisma";

// Lib
import { generateTokenAndSetCookie } from "@/lib/set-token-cookie";
import { verifyUser } from "@/lib/verify-user";

// Schemas
import { resetEmail, verifyEmail } from "@repo/schemas/auth";

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

  const { data: validateData, success } = resetEmail.safeParse(data);

  console.log(validateData);
  if (!success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const {
    // success: successResend,
    hashedOtp,
    // message,
    expireDate,
  } = await verifyUser(validateData.email);

  // if (!successResend) {
  //   return res.status(400).json({
  //     message: message,
  //   });
  // }

  // Da budem jasan ne šaljem kod više korisnika, nego updaeMany će samo updateti onog korisnika koji već ima neki token (koji se pokušao logirati) --> ovo je napravljeno kao dodatan sloj sigurnosti da se ne može zloupotrijebiti endpoint za slanje kodova
  const updatedUser = await prisma.user.updateMany({
    where: {
      email: validateData.email,
      AND: [
        { verificationToken: { not: null } },
        { verificationToken: { not: "" } },
      ],
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

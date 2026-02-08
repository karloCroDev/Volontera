// External packages
import bcrypt from "bcrypt";
import { createElement } from "react";

// Config
import { resend } from "@/lib/config/resend";

// Transactional emails
import { VerificationCode } from "@repo/transactional/verification-code";

export async function verifyUser(email: string) {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Confirm your email address",
    react: createElement(VerificationCode, {
      verificationCode: verificationToken,
    }),
  });
  const hashedOtp = bcrypt.hashSync(verificationToken, 10);

  const expireDate: bigint = BigInt(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  return { hashedOtp, expireDate } as const;
}

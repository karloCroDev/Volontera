import { sendEmail } from "@/src/config/nodemailer";
import { resend } from "@/src/config/resend";
import bcrypt from "bcrypt";

export async function verifyUser(email: string) {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  if (process.env.NODE_ENV === "production") {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Confirm your email address",
      html: `<p>Your code: ${verificationToken}</p>`, // Karlo dodaj shared components i dodaj react email i ondaj dodaj mail
    });

    if (error) {
      return {
        message: "Error when sending the email address" as const,
        success: false,
      } as const;
    }
  } else {
    await sendEmail({
      html: `<p>Your code: ${verificationToken}</p>`,
      subject: "Confirm your email address",
      to: email,
    });
  }

  const hashedOtp = bcrypt.hashSync(verificationToken, 10);

  const expireDate = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  return { hashedOtp, expireDate, success: true } as const;
}

// External packages
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createElement } from "react";

// Lib
import { resend } from "@/config/resend";

// Shared utils
import {
  ForgotPasswordArgs,
  LoginArgs,
  RegisterArgs,
  ResetEmailArgs,
  resetPasswordSchema,
  VerifyEmailArgs,
} from "@repo/schemas/auth";

// Models
import {
  clearOtpVerification,
  createUser,
  findUserByEmail,
  findUserForOtpVerification,
  resetPasswordByToken,
  updateResetPasswordToken,
  updateVerificationData,
  updateVerificationToken,
} from "@/models/auth.model";

// Lib
import { verifyUser } from "@/lib/verify-user";

// Transactional emails
import { ForgotPassword } from "@repo/transactional/forgot-password";
import { RecentLogin } from "@repo/transactional/recent-login";

export async function loginService(data: LoginArgs) {
  const user = await findUserByEmail(data.email);
  if (!user) {
    return { status: 400, body: { message: "Invalid email" } };
  }

  const passwordIsValid = bcrypt.compareSync(data.password, user.password);
  if (!passwordIsValid) {
    return { status: 400, body: { message: "Invalid password" } };
  }

  const { hashedOtp, expireDate } = await verifyUser(data.email);

  const updatedUser = await updateVerificationData({
    email: data.email,
    verificationToken: hashedOtp ?? null,
    verificationTokenExpiresAt: expireDate ?? null,
  });
  if (!updatedUser) {
    return { status: 400, body: { message: "Error with email" } };
  }

  return {
    status: 200,
    body: {
      title: "Success",
      message: "Checkout your email inbox for verification code",
    },
  };
}

export async function registerService({
  email,
  firstName,
  lastName,
  password,
}: RegisterArgs) {
  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      status: 400,
      body: { message: "Already existing user, please login!" },
    };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const { hashedOtp, expireDate } = await verifyUser(email);

  await createUser({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    verificationToken: hashedOtp ?? null,
    verificationTokenExpiresAt: expireDate ?? null,
  });

  return {
    status: 200,
    body: {
      title: "Success",
      message: "Checkout your email inbox for verification code",
    },
  };
}

export async function forgotPasswordService({ email }: ForgotPasswordArgs) {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpireDate: bigint = BigInt(Date.now() + 60 * 60 * 1000); // 1 hour

  const user = await updateResetPasswordToken({
    email,
    resetToken,
    resetTokenExpireDate,
  });

  if (!user) {
    return {
      status: 400,
      body: { message: "Invalid email" },
    };
  }

  const resetLink = `${process.env.WEB_URL}/auth/login/forgot-password/reset-password?token=${resetToken}`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Reset your password",
    react: createElement(ForgotPassword, { link: resetLink }),
  });

  if (error) {
    return {
      status: 400,
      body: { message: "Error sending email" },
    };
  }

  return {
    status: 200,
    body: {
      title: "Forgot password link is sent",
      message: "Forgot password link is sent",
    },
  };
}

export async function resetPasswordService(rawData: unknown) {
  const parsed = resetPasswordSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: 400,
      body: { message: "Invalid data" },
    };
  }

  const data = parsed.data;

  const hashedPassword = bcrypt.hashSync(data.password, 10);

  const user = await resetPasswordByToken({
    resetToken: data.token,
    expireDate: BigInt(Date.now()),
    hashedPassword,
  });

  if (!user) {
    return {
      status: 400,
      body: { message: "Invalid token" },
    };
  }

  return {
    status: 200,
    body: {
      title: "Success",
      message: "Your password is successfully updated!",
    },
  };
}

export async function verifyOtpService({ code, email }: VerifyEmailArgs) {
  const user = await findUserForOtpVerification(email);

  if (!user || !user.verificationToken) {
    return { status: 400, body: { message: "Invalid code" } };
  }

  const isValidOtp = await bcrypt.compare(code, user.verificationToken);

  if (!isValidOtp) {
    return { status: 400, body: { message: "Invalid code" } };
  }

  await clearOtpVerification(user.id);

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Recent login notification",
    react: createElement(RecentLogin, {
      firstName: user.firstName,
      lastTimeLoggedIn: new Date(),
    }),
  });

  return {
    status: 200,
    body: { message: "User verified successfully", user },
  };
}

export async function resetVerifyTokenService({ email }: ResetEmailArgs) {
  const { hashedOtp, expireDate } = await verifyUser(email);

  const { count } = await updateVerificationToken({
    email,
    hashedOtp: hashedOtp ?? null,
    expireDate: expireDate ?? null,
  });

  if (count === 0) {
    return { status: 400, body: { message: "Error with email" } };
  }

  return {
    status: 200,
    body: { message: "Verification code refreshed successfully" },
  };
}

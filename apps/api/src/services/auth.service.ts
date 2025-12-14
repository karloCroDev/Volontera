// External packages
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Lib
import { sendEmail } from "@/config/nodemailer";
import { resend } from "@/config/resend";

// Shared utils
import {
  forgotPasswordSchema,
  LoginArgs,
  loginSchema,
  registerSchema,
  resetEmail,
  resetPasswordSchema,
  verifyEmail,
} from "@repo/schemas/auth";

// Models
import {
  clearOtpVerification,
  createUser,
  findUserByEmail,
  findUserById,
  findUserForOtpVerification,
  resetPasswordByToken,
  updateResetPasswordToken,
  updateVerificationData,
  updateVerificationToken,
} from "@/models/auth-model";

// Lib
import { verifyUser } from "@/lib/verify-user";
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";

export async function loginService(rawData: LoginArgs) {
  const { data, success } = loginSchema.safeParse(rawData);
  if (!success) {
    return { status: 400, body: { message: "Provided data is incorrect" } };
  }

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
    verificationToken: hashedOtp,
    verificationTokenExpiresAt: expireDate,
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

export async function registerService(rawData: unknown) {
  const { success, data } = registerSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: { message: "Provided data is incorrect" },
    };
  }

  const existing = await findUserByEmail(data.email);
  if (existing) {
    return {
      status: 400,
      body: { message: "Already existing user, please login!" },
    };
  }

  const hashedPassword = bcrypt.hashSync(data.password, 10);

  const { hashedOtp, expireDate } = await verifyUser(data.email);

  await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    verificationToken: hashedOtp,
    verificationTokenExpiresAt: expireDate,
  });

  return {
    status: 200,
    body: {
      title: "Success",
      message: "Checkout your email inbox for verification code",
    },
  };
}

export async function forgotPasswordService(rawData: unknown) {
  const { success, data } = forgotPasswordSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: { message: "Invalid data" },
    };
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpireDate: bigint = BigInt(Date.now() + 60 * 60 * 1000); // 1 hour

  const user = await updateResetPasswordToken({
    email: data.email,
    resetToken,
    resetTokenExpireDate,
  });

  if (!user) {
    return {
      status: 400,
      body: { message: "Invalid email" },
    };
  }

  const resetLink = `http://localhost:${process.env.NEXT_PORT}/auth/forgot-password/reset-password?token=${resetToken}`;

  if (process.env.NODE_ENV === "production") {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: data.email,
      subject: "Reset your password",
      html: `<p>${resetLink}</p>`,
    });

    if (error) {
      return { status: 400, body: { message: "Error with email" } };
    }
  } else {
    await sendEmail({
      to: data.email,
      subject: "Reset your password",
      html: `<p>${resetLink}</p>`,
    });
  }

  return {
    status: 200,
    body: { message: "Email sent" },
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
    body: { message: "Your password is successfully updated!" },
  };
}

export async function verifyOtpService(rawData: unknown) {
  const { success, data } = verifyEmail.safeParse(rawData);

  if (!success) {
    return { status: 400, body: { message: "Invalid data" } };
  }

  const user = await findUserForOtpVerification(data.email);

  if (!user || !user.verificationToken) {
    return { status: 400, body: { message: "Invalid code" } };
  }

  const isValidOtp = await bcrypt.compare(data.code, user.verificationToken);

  if (!isValidOtp) {
    return { status: 400, body: { message: "Invalid code" } };
  }

  await clearOtpVerification(user.id);

  return {
    status: 200,
    body: { message: "User verified successfully", user },
  };
}

export async function resetVerifyTokenService(rawData: unknown) {
  const { success, data } = resetEmail.safeParse(rawData);

  if (!success) {
    return { status: 400, body: { message: "Invalid data" } };
  }

  const { hashedOtp, expireDate } = await verifyUser(data.email);

  const { count } = await updateVerificationToken({
    email: data.email,
    hashedOtp,
    expireDate,
  });

  if (count === 0) {
    return { status: 400, body: { message: "Error with email" } };
  }

  return {
    status: 200,
    body: { message: "Verification code refreshed successfully" },
  };
}

export async function getSessionUser(userId: string) {
  const user = await findUserById(userId);

  if (!user)
    return {
      status: 400,
      body: {
        message: "There is no user that we could find with that ID",
        success: false,
      },
    };

  let userData = user;

  if (user.image) {
    // const image = !user.image.includes("lh3.googleusercontent.com")
    //   ? await getImagePresignedUrls(user.image)
    //   : user.image;

    const image = await getImagePresignedUrls(user.image);
    userData = { ...user, image };
  }
  return {
    status: 200,
    body: {
      message: "User fetched successfully",
      success: true,
      ...userData,
      fullname: `${user.firstName} ${user.lastName}`,
    },
  };
}

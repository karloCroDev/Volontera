// External packages
import { User } from "@prisma/client";

// Config
import { prisma } from "@/config/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: {
  firstName: User["firstName"];
  lastName: User["lastName"];
  email: User["email"];
  password: User["password"];
  verificationToken: User["verificationToken"];
  verificationTokenExpiresAt: User["verificationTokenExpiresAt"];
}) {
  return prisma.user.create({ data });
}

export async function updateVerificationData({
  email,
  verificationToken,
  verificationTokenExpiresAt,
}: {
  email: User["email"];
  verificationToken: User["verificationToken"];
  verificationTokenExpiresAt: User["verificationTokenExpiresAt"];
}) {
  return prisma.user.update({
    where: { email },
    data: {
      verificationToken,
      verificationTokenExpiresAt,
    },
  });
}

// Verifications
export async function updateResetPasswordToken({
  email,
  resetToken,
  resetTokenExpireDate,
}: {
  email: User["email"];
  resetToken: User["resetToken"];
  resetTokenExpireDate: User["resetTokenExpireDate"];
}) {
  return prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpireDate,
    },
  });
}

export async function resetPasswordByToken({
  expireDate,
  hashedPassword,
  resetToken,
}: {
  resetToken: NonNullable<User["resetToken"]>;
  expireDate: bigint;
  hashedPassword: string;
}) {
  return prisma.user.update({
    where: {
      resetToken,
      resetTokenExpireDate: {
        gt: expireDate,
      },
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpireDate: null,
    },
  });
}

export async function findUserForOtpVerification(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
      verificationTokenExpiresAt: {
        gt: BigInt(Date.now()),
      },
    },
  });
}

export async function clearOtpVerification(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });
}

export async function updateVerificationToken({
  email,
  expireDate,
  hashedOtp,
}: {
  email: User["email"];
  hashedOtp: User["verificationToken"];
  expireDate: User["verificationTokenExpiresAt"];
}) {
  return prisma.user.updateMany({
    where: {
      email,
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
}

export async function findUserById(userId: User["id"]) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      subscriptionTier: true,
      onboardingFinished: true,
      subscriptionType: true,
    },
  });
}

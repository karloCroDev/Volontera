// External packages
import { z } from "zod";

// Register
export const registerSchema = z.object({
  firstName: z.string("First name is required").min(2).max(16),
  lastName: z.string("Last name is required").min(2).max(16),
  email: z.email(),
  password: z.string("Password is required").min(8).max(16),
});
export type RegisterArgs = z.infer<typeof registerSchema>;

// Login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string("Password is required").min(8).max(16),
});
export type LoginArgs = z.infer<typeof loginSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordArgs = z.infer<typeof forgotPasswordSchema>;

// Reset password
export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8).max(16),
    repeatPassword: z.string().min(8).max(16),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type ResetPasswordArgs = z.infer<typeof resetPasswordSchema>;

// Verify email
export const verifyEmail = z.object({
  code: z.string().min(6).max(6),
  email: z.email(),
});
export type VerifyEmailArgs = z.infer<typeof verifyEmail>;

export const resetEmail = z.object({
  email: z.email(),
});

export type ResetEmailArgs = z.infer<typeof resetEmail>;

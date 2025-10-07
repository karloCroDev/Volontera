import { LoginArgs, RegisterArgs } from "@repo/schemas/auth";

// Login / Register response

type AuthResponse = {
  success: boolean;
  message: string;
};

export type LoginResponse = AuthResponse & {
  errors?: Record<keyof LoginArgs, string>;
};

export type RegisterResponse = AuthResponse & {
  errors?: Record<keyof RegisterArgs, string>;
};

// Session (User)
export type User = {
  id: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  role: "USER" | "ORGANIZATION" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;

  subscriptionTier: "BASIC" | "PREMIUM";
  subscriptionType: "NONE" | "MONTHLY" | "YEARLY";
};

export type SessionSuccessResponse = User & {
  message: string;
  success: true;
};

// See if I want to handle this with toast messgaes or something simmilar!
type SessionErrorResponse = {
  message?: string;
  error?: string;
  success: false;
};

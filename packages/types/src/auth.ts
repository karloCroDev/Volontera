import { SuccessfulResponse } from "./general";
// Login / Register response

// export type LoginResponse = AuthResponse & {
//   errors?: Record<keyof LoginArgs, string>;
// };

// export type ErrorAuthResponse = AuthResponse & {
//   errors?: Record<keyof RegisterArgs, string>;
// };

// Session (User)
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  bio?: string;
  role: "USER" | "ORGANIZATION" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;

  subscriptionTier: "BASIC" | "PREMIUM";
  subscriptionType: "NONE" | "MONTHLY" | "YEARLY";
};

export type SessionSuccessResponse = User & SuccessfulResponse;

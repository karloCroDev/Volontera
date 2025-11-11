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
  fullname: string;
  email: string;
  image?: string;
  bio?: string;
  DOB?: string;
  workOrSchool?: string;
  role: "USER" | "ORGANIZATION" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
  onboardingFinished: boolean;
  subscriptionTier: "BASIC" | "PREMIUM";
  subscriptionType: "NONE" | "MONTHLY" | "YEARLY";
};

export type SessionSuccessResponse = User &
  SuccessfulResponse & { success: boolean };

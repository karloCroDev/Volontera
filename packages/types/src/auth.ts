import { ServerHandleResponse } from "./general";

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
  address?: string;
  workOrSchool?: string;
  role: "USER" | "ORGANIZATION" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
  onboardingFinished: boolean;
  pricingId?: string;
  subscriptionTier: "BASIC" | "PRO";
  subscriptionType: "NONE" | "MONTHLY" | "YEARLY";
};

export type SessionSuccessResponse = User & ServerHandleResponse<true>;

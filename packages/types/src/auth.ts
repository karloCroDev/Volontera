import type { ServerHandleResponse } from "./general";
import type { User as PrismaUser } from "@repo/database";

// Session (User)
export type User = {
  id: PrismaUser["id"];
  firstName: PrismaUser["firstName"];
  lastName: PrismaUser["lastName"];
  fullname: string;
  email: PrismaUser["email"];
  image?: PrismaUser["image"];
  bio?: PrismaUser["bio"];
  DOB?: PrismaUser["DOB"];
  address?: PrismaUser["address"];
  workOrSchool?: PrismaUser["workOrSchool"];
  role: PrismaUser["role"];
  createdAt: PrismaUser["createdAt"];
  updatedAt: PrismaUser["updatedAt"];
  onboardingFinished: PrismaUser["onboardingFinished"];
  pricingId?: PrismaUser["pricingId"];
  subscriptionTier: PrismaUser["subscriptionTier"];
  subscriptionType: PrismaUser["subscriptionType"];
};

export type SessionSuccessResponse = User & ServerHandleResponse<true>;

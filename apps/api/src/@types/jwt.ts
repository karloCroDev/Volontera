// External packages
import { type User } from "@prisma/client";

export interface JwtUser {
  userId: string;
  role: User["role"];
  // subscriptionTier: User["subscriptionTier"];
  onboardingFinished: User["onboardingFinished"];
}

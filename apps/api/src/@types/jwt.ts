// External packages
import { User } from "@repo/database";

export interface JwtUser {
  userId: string;
  role: User["role"];
  // subscriptionTier: User["subscriptionTier"];
  onboardingFinished: User["onboardingFinished"];
}

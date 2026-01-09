// External packages
import { User } from "@repo/database";

export interface JwtUser {
  userId: string;
  role: User["role"];
  onboardingFinished: User["onboardingFinished"];
}

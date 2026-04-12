// Database
import { User } from "@repo/database";

export function hasPassword(password: User["password"]) {
  return Boolean(password && password.trim().length > 0);
}

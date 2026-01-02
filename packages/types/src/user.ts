import type { ServerHandleResponse } from "./general";
import type { User as PrismaUser } from "@repo/database";

// Session (User)

export type UserResponse = Omit<PrismaUser, "password"> &
  ServerHandleResponse<true>;

import type { ServerHandleResponse } from "./general";
import type { User as PrismaUser } from "@repo/database";

// Session (User)

export type SessionSuccessResponse = Omit<PrismaUser, "password"> &
  ServerHandleResponse<true>;

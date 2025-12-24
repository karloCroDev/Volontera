import type { ServerHandleResponse } from "./general";
import type { User as PrismaUser } from "@repo/database";

// Session (User)
export type User = Omit<PrismaUser, "password"> & {
  fullname: string;
};

export type SessionSuccessResponse = User & ServerHandleResponse<true>;

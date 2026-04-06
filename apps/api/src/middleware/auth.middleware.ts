// External packages
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware
import { JwtUser } from "@/@types/jwt";

// Models
import { findUserById } from "@/models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user: JwtUser;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Auth token missing" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// export async function authMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(401).json({ message: "Auth token missing" });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string,
//     ) as JwtUser;

//     const user = await findUserById(decoded.userId);

//     if (!user) {
//       res.clearCookie("token");
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     if (user.isBanned) {
//       res.clearCookie("token");
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden: Your account is banned",
//       });
//     }

//     req.user = {
//       userId: user.id,
//       role: user.role,
//       onboardingFinished: user.onboardingFinished,
//     };

//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// }

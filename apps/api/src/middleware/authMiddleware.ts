import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string | undefined = req.cookies.token;
  if (!token)
    return res.status(400).json({ message: "No token has been provided" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(400);
    //@ts-ignore
    req.user = user;

    next();
  });
}

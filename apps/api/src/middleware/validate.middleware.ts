// External packages
import { zodErrorDetecter } from "@/lib/utils/zodDetectionError";
import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate<T>({
  schema,
  type = "body",
  responseOutput = "toast",
}: {
  schema: ZodType<T>;
  type?: "body" | "query" | "params";
  responseOutput?: "get" | "toast" | "form";
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[type]);

    if (!result.success) {
      //   console.log("Validation result:", zodErrorDetecter(result.error));  Koristiti za debugiranje kod korisništejna controllera
      switch (responseOutput) {
        case "get":
          return res
            .status(400)
            .json({ success: false, message: "Invalid request data" });
        case "toast":
          return res
            .status(400)
            .json({ title: "Error", message: "Invalid request data" });
        case "form":
          return res.status(400).json({ message: "Invalid request data" });
      }
    }
    next();
  };
}

// External packages
import { z } from "zod";

// Generic function for getting the error back from the server
export function zodErrorDetecter<T>(result: z.ZodError<T>) {
  let zodErrors: Partial<Record<keyof T, string>> = {}; //

  result.issues.forEach((issue) => {
    zodErrors = { ...zodErrors, [issue.path[0] as string]: issue.message };
  });

  return zodErrors;
}

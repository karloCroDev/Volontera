// External packages
import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate<T>({
  schema,
  type = "body",
  responseOutput = "toast",
}: {
  schema: ZodType<T>;
  type?: "body" | "query" | "params";
  responseOutput?: "server" | "toast" | "form";
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[type]);
    if (!result.success) {
      //   console.log("Validation result:", zodErrorDetecter(result.error));  Koristiti za debugiranje kod korisništejna controllera

      // Ovdje samo handleam posebno slučaj responsea od middleewarea, jer može biti bitan za validaciju na frontendu. Iako handleam validaciju formi na frontendu, može se kod npr. kod "get" requesta desiti npr. da korisnik ručno mijenja query parametre u URL-u pa da se pošalje nevalidan request. Npr. ako očekujem cuid a korisnik pošalje neki string koji nije validan cuid onda će ovo uhvatiti (svkako će), ali će i frontend moći pravilno obraditi error jer će dobiti odgovor koji očekuje.
      switch (responseOutput) {
        case "server":
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

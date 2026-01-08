// External packages
import { Response } from "express";

export function handleServerErrorResponse(res: Response, err: unknown) {
  // U buduće ovdje handlaj još neke errore ako bude trebalo
  return res.status(500).json({
    message: err instanceof Error ? err.message : "Internal Server Error",
  });
}

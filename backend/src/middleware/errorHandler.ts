import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    const formatted = err.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message
    }));

    return res.status(400).json({
      message: "Validation error",
      errors: formatted
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
};

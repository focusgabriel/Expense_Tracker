import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        res.status(400).json({
          success: false,
          message: result.error.flatten().fieldErrors ?? "Validation failed",
          errors: fieldErrors,
        });
        return;
      }

      req.body = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: error.flatten().fieldErrors ?? "Validation failed",
          errors: error.flatten().fieldErrors,
        });
        return;
      }

      next(error);
    }
  };
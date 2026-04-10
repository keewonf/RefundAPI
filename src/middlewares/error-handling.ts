import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "@/utils/AppError";
import { z, ZodError } from "zod";
import multer from "multer";

const errorHandling: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Validation error!", issues: z.treeifyError(error) });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.message === "Invalid file format") {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({ message: error.message });
};

export { errorHandling };

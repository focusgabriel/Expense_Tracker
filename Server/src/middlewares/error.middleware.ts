import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err:Error,
  req:Request,
  res:Response,
  next:NextFunction
) => {
  if(err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  console.error(err);

  res.status(500).json({
    status: false,
    message: "Internal Server Error"
  })
}
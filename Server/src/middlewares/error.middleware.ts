import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err:Error,
  req:Request,
  res:Response,
  next:NextFunction
) => {

  if(res.headersSent){
    return next(err);
  }

  if(err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    status: false,
    message: err.message ?? "Internal Server Error"
  })
}
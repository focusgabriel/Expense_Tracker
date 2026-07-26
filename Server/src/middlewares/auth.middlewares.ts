import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  
    // const authHeader = req.headers.authorization;
    // if(!authHeader){
    //   return res.status(401).json({errorMsg: "no token provided"})
    // }
    // if(!authHeader.startsWith("Bearer ")){
    //   return res.status(401).json({errorMsg: "Invalid authorization format"})
    // }
    // const token = authHeader.split(" ")[1]!;


    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(typeof decoded === "string" || !("sub" in decoded)){
          throw new AppError("Invalid Token", 401);
        }
        req.user = {
          id: decoded.sub as string,
        }
      next()
  } catch (error) {
      throw new AppError("Invalid Token", 401);
  }
}




import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return res.status(401).json({errorMsg: "no token provided"})
    }
    if(!authHeader.startsWith("Bearer ")){
      return res.status(401).json({errorMsg: "Invalid authorization format"})
    }
    const token = authHeader.split(" ")[1]!;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if(typeof decoded === "string" || !("sub" in decoded)){
          return res.status(401).json({errorMsg: "Invalid Token"})
        }
        req.user = {
          id: decoded.sub as string,
        }
      next()
  } catch (error) {
    return res.status(401).json({errorMsg: "Invalid Token"})
  }
}



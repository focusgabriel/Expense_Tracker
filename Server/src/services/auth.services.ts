import { authUser, } from "../repository/auth.repository.js";
import { AppError } from "../utils/AppError.js";

export async function getUser(userId:string){
  if(!userId || userId === ""){
    throw new AppError("User not Found.", 404)
  }

  return await authUser(userId);
} 

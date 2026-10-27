import { authModel } from "../model/index.js";

export async function authUser(userId: string){
  return await authModel.findById(userId).select("name email")
}
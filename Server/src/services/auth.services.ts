import { userDto } from "../dto/user.dto.js";
import { authUser, createUser, currentUser, forgotPassword, logoutUser, logUser, resetPassword, tokenRefresher, verifyEmail, } from "../repository/auth.repository.js";
import { AppError } from "../utils/AppError.js";

export async function getUser(userId:string){
  if(!userId || userId === ""){
    throw new AppError("User not Found.", 404)
  }

  return await authUser(userId);
} 


export async function registerUser({
  name,
  email,
  password,
  verificationToken,
  verificationTokenExpires
}: userDto) {

  if(name === "" || email === "" || password === "" ) {
    throw new AppError("Please fill out the spaces correctly", 400);
  }
  
  return await createUser({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpires  
  });
}


export async function loginUser(email: string) {
  if(email === "") {
    throw new AppError("field shouldn't be empty", 400)
  }

  return await logUser(email);
}

export async function getRefreshToken(id:string | undefined, refreshToken: any) {
  if(!id || !refreshToken) {
    throw new AppError("Refresh Token and id is required", 400)
  }

  return await tokenRefresher(id, refreshToken);
}


export async function getCurrentUser(user:string){
  if(!user){
    throw new Error("user not found");
  }

  return await currentUser(user);
}


export async function getLogoutUser(user: string) {
  if(!user){
    throw new Error("user not found");
  }

  return await logoutUser(user)
}


export async function getVerifyEmail(hashedToken:string){
  if(!hashedToken){
    throw new Error("hashed token is required")
  }

  return await verifyEmail(hashedToken);
}


export async function getForgotPassword(email:string){
  if(email === ""){
    throw new Error("email is required");
  }

  return await forgotPassword(email);
}


export async function getResetPassword(hashedToken:string) {
  if(!hashedToken) {
    throw new Error("hashed Token is required");
  }

  return await resetPassword(hashedToken);
}
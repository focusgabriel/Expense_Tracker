import { userDto } from "../dto/user.dto.js";
import { authModel } from "../model/index.js";

export async function authUser(userId: string){
  return await authModel.findById(userId).select("name email")
}

export async function createUser({name,email,password,verificationToken,verificationTokenExpires
}: userDto) {
  return await authModel.create({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpires
  })
}

export async function logUser(email: string) {
  return await authModel.findOne({email});
}

export async function tokenRefresher(id: string | undefined, refreshToken: any) {
  return await authModel.findOne({_id:id, refreshToken})
}

export async function currentUser(user:string) {
  return await authModel.findById(user).select(
    "-password -refreshToken"
  )
}

export async function logoutUser(user:string){
  return await authModel.findById(user);
}

export async function verifyEmail(hashedToken: string){
  return await authModel.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: {
      $gt: new Date(),
    },
  });
}

export async function forgotPassword(email:string){
  return authModel.findOne({ email });
}

export async function resetPassword(hashedToken:string){
  return await authModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: new Date()
    }
  });
}
import {NextFunction, Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {LoginRequestBody, RefreshRequestBody, RegisterRequestBody} from "../types/express/users.types.js"
// import authModel from "../model/users.js"
// import { hash } from "node:crypto"
import { authModel } from "../model/index.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import { loginSchema, registerSchema } from "../validation/auth.schema.js"
import { AppError } from "../utils/AppError.js"
import crypto from "crypto";
import { sendEmail } from "../services/email.services.js"

export async function RegisterController(
  req:Request<{}, {}, RegisterRequestBody>,
  res:Response,
  next:NextFunction
) {
  try {
    const {name, email, password, confirm_password} = req.body

    registerSchema

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const verifiedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verifiedToken).digest("hex");
    const expireToken = new Date(Date.now() + 1000 * 60 * 60  );//1 hour

    const user = await authModel.create({
      name,
      email,
      password:hashedPassword,
      verificationToken: hashedToken,
      verificationTokenExpires: expireToken
    })

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verifiedToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your Expense Tracker account",
      html: `
        <h2>Welcome to Expense Tracker!</h2>

        <p>Click the button below to verify your account.</p>

        <a href="${verificationUrl}">
          Verify Account
        </a>

        <p>This link expires in 1 hour.</p>
      `,
    });
    
    return res.status(201).json({msg: "Registration successful. Please check your email to verify your account."});
    

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    next(error)
  }

}
export async function loginController(req: Request<{}, {}, LoginRequestBody>,res: Response) {
  const {email, password} = req.body;

  loginSchema

  const user = await authModel.findOne({email});
  if (!user!.isVerified) {
  throw new AppError(
    "Please verify your email before logging in.",
    401
  );
}
  const isMatch = await bcrypt.compare(password, user!.password)
  if(!isMatch){
    throw new AppError("Invalid Credentials", 400);
  }

  const accessToken = generateAccessToken( user!._id.toString() );
  const refreshToken = generateRefreshToken( user!._id.toString() );
  user!.refreshToken = refreshToken;
  await user!.save();
  return res.status(200).json({
    accessToken,
    refreshToken: refreshToken,
    user: {
      id: user!._id,
      email: user!.email
    }
  })
  
}

export async function refreshTokenController(req: Request<{}, {}, RefreshRequestBody>, res:Response, next:NextFunction) {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken){
      throw new AppError("Refresh Token is required.", 400)
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );

    if(typeof decoded === "string" || !("sub" in decoded)){
      throw new AppError("Invalid token", 400);
    }

    const user = await authModel.findOne({_id: decoded.sub, refreshToken});
    if (!user) {
      throw new AppError("Invalid refresh token", 400);
    }
    // Generate a new access token
    const accessToken = generateAccessToken(user._id.toString());

    // Generate a new refresh token
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;

    await user.save();
    // Return it
    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    next(error)
  }
}
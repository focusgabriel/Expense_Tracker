import {NextFunction, Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {LoginRequestBody, RefreshRequestBody, RegisterRequestBody} from "../types/express/users.types.js"
import { authModel } from "../model/index.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import { loginSchema, registerSchema } from "../validation/auth.schema.js"
import { AppError } from "../utils/AppError.js"
import crypto from "crypto";
import { sendEmail } from "../services/email.services.js"
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" as const: "lax" as const,
  path: "/",
};

export async function RegisterController (
  req:Request<{}, {}, RegisterRequestBody>,
  res:Response,
  next:NextFunction
) {
  try {
    const {name, email, password, confirm_password} = req.body

    // the register helper function validation from Zod
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
      subject: "Verify Your Expense Tracker Account",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
          .warning { color: #666; font-size: 13px; margin-top: 15px; }
        </style>
        </head>
        <body>
        <div class="container">
          <div class="header">
          <h1>Welcome to Expense Tracker!</h1>
          <p>Thank you for signing up. We're excited to have you on board.</p>
          </div>

          <p>To complete your registration and secure your account, please verify your email address by clicking the button below:</p>

          <a href="${verificationUrl}" class="button" style="color:white;">Verify Email Address</a>

          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>

          <div class="warning">
          <p><strong>Security Note:</strong></p>
          <p>This verification link will expire in 1 hour. If you did not create this account, please ignore this email or contact our support team.</p>
          </div>

          <div class="footer">
          <p>Best regards,<br>The Expense Tracker Team</p>
          <p>If you have any questions, leave a reply.</p>
          
        </div>
        </body>
      </html>
      `,
    });
    
    return res.status(201).json({msg: "Registration successful. Please check your email to verify your account."});
    

  } catch (error) {
    next(error)
  }

}


export async function loginController(req: Request<{}, {}, LoginRequestBody>,res: Response) {
  const {email, password} = req.body;
  
  // the register helper function validation from Zod
  loginSchema

  const user = await authModel.findOne({email});
  if (!user) {
  throw new AppError(
    "Invalid Credentials.",
    401
  );
}

  if (!user!.isVerified) {
    throw new AppError(
      "Please verify your email before logging in.",
      401
    );
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new AppError("Invalid Credentials", 400);
  }

  const accessToken = generateAccessToken( user._id.toString() );
  const refreshToken = generateRefreshToken( user._id.toString() );
  user.refreshToken = refreshToken;
  await user.save();

  // const isProduction = process.env.NODE_ENV === "production"

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge:  15 * 60 * 1000,
  });


  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge:  7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    user: {
      id: user!._id,
      email: user!.email
    }
  })
  
}

export async function refreshTokenController(req: Request<{}, {}, RefreshRequestBody>, res:Response, next:NextFunction) {
  try {
    // const { refreshToken } = req.body;
    const refreshToken = req.cookies.refreshToken;
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

    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: isProduction,
    //   sameSite: isProduction ? "none" as const: "lax" as const,
    //   path: "/",
    // };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge:  15 * 60 * 1000,
    });


    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: 200,
      message: "Refresh token activated"
    });

  } catch (error) {
    next(error)
  }
}
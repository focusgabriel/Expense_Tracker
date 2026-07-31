import { Response, Request, NextFunction } from "express";
import { authModel } from "../model/index.js";
import crypto from "crypto";
import bcrypt from "bcrypt"
import { AppError } from "../utils/AppError.js";
import resetPasswordTemplate from "../services/emailSender/templates/passwordResetTemplate.js";
import { sendResetPasswordEmail } from "../services/emailSender/passwordResetEmail.js";
// import { sendEmail } from "../services/email.services.js";
const isProduction = process.env.NODE_ENV === "production";


export async function getCurrentUserController(req:Request, res:Response, next:NextFunction) {
  
    const user = await authModel.findById(req.user!.id).select(
      "-password -refreshToken"
    )

    if(!user) { 
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      user,
    });
}

export async function logoutController(req:Request, res:Response, next:NextFunction) {
  try {

    const user = await authModel.findById(req.user!.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

   res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const: "lax" as const,
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const: "lax" as const,
    path: "/",
  });
    
    await user.save();

    return res.status(200).json({
        success:true,
        message: "Logged out successfully."
    });

  } catch (error) {
    next();
  }
}

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    if (typeof token !== "string" || token.length === 0) {
      throw new AppError(
        "Verification token is missing or invalid.",
        400
      );
    }

    // since the verification token in the database is hashed in order to find it using findOne we have to also hash the token on this side so it can find it in the database.
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
      

    const user = await authModel.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      throw new AppError(
        "Verification token is invalid or has expired.",
        400
      );
    }

    user.isVerified = true;

    user.verificationToken = undefined;

    user.verificationTokenExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
    
  } catch (err) {
    next(err);
  }
};

export const ForgotPasswordController = async(
  req:Request,
  res:Response,
  next:NextFunction
) => {
  const { email } = req.body;
  try {

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;

    user.passwordResetExpires = new Date(
      Date.now() + 1000 * 60 * 15
    );

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    try {
      await sendResetPasswordEmail(user.email, resetUrl);
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      throw new AppError("Failed to send reset password email. Please try again later.", 500);
    }
        // 

    return res.status(200).json({
      status: true,
      message: "If an account with that email exists, a reset link has been sent."
    });
  } catch (error) {
    next(error);
  }
}
 
export const ResetPasswordController = async(
  req:Request,
  res:Response,
  next:NextFunction
) => {
  const { token } = req.params
  const { password } = req.body;
  try {

    if(typeof token !== "string" || token?.length === 0){
      throw new AppError("token is invalid.", 400);
    }
    
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await authModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date()
      }
    })

    if (!user) {
      throw new AppError(
        "Reset token is invalid or has expired.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    user.refreshToken = null;

    await user.save();

    return res.status(200).json({
      success:true,
      message: "Password reset successful.",
    });

  } catch (error) {
    next(error)
  }
}


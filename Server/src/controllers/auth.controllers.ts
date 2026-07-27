import { Response, Request, NextFunction } from "express";
import { authModel } from "../model/index.js";
import crypto from "crypto";
import bcrypt from "bcrypt"
import { AppError } from "../utils/AppError.js";
import { sendEmail } from "../services/email.services.js";
const isProduction = process.env.NODE_ENV === "production";


export async function getCurrentUserController(req:Request, res:Response) {
  
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

export async function logoutController(req:Request, res:Response) {
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
        message: "Logged out successfully."
    });

  } catch (error) {
    return res.status(500).json({
        errorMsg: error
    });
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
        status: true,
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

    const verificationUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
        await sendEmail({
          to: user.email,
          subject: "Reset Your Expense Tracker Password",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
            .warning { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 3px; }
          </style>
              </head>
              <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi,</p>
              <p>We received a request to reset the password for your Expense Tracker account. If you didn't make this request, you can safely ignore this email.</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Reset Your Password</a>
              </p>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px;">${verificationUrl}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 15 minutes for your protection.
              </div>
              <p><strong>Didn't request a password reset?</strong> Your account may be compromised. Please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Expense Tracker. All rights reserved.</p>
            </div>
          </div>
              </body>
            </html>
          `,
        });

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
      success: true,
      message: "Password reset successful.",
    });

  } catch (error) {
    next(error)
  }
}


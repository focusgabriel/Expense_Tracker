import { Response, Request, NextFunction } from "express";
import { authModel } from "../model/index.js";
import crypto from "crypto";
import { AppError } from "../utils/AppError.js";

export async function logoutController(req:Request, res:Response) {
  try {
    console.log("making a logout request", req.user!.id);
    const user = await authModel.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({
          message: "User not found"
      });
    }

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
        message: "Logged out successfully."
    });

  } catch (error) {
    console.error("backend error:", error);
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

    console.log("email clicked...")
    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
    
  } catch (err) {
    next(err);
    console.log("failed to verify email...")
  }
};
import { Response, Request } from "express";
import { authModel } from "../model/index.js";

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
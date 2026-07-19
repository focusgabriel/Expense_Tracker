import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {LoginRequestBody, RefreshRequestBody, RegisterRequestBody} from "../types/express/users.types.js"
// import authModel from "../model/users.js"
// import { hash } from "node:crypto"
import { authModel } from "../model/index.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"


export async function RegisterController(
  req:Request<{}, {}, RegisterRequestBody>,
  res:Response
) {
  try {
    const {name, email, password, confirm_password} = req.body

    if(
      !name ||
      !email ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({errorMsg: "All fields are required"})
    }

    if(password !== confirm_password){
      return res.status(400).json({errorMsg: "Password do not match"})
    }

    if(password.length < 8){
      return res.status(400).json({errorMsg: "Password must be atleast 8 characters"})
    }

    const emailValidation = await authModel.findOne({email});
    if(emailValidation){
      return res.status(500).json({errroMsg: "Email already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await authModel.create({
      name,
      email,
      password:hashedPassword
    })
    return res.status(201).json({msg: "User Created Successfully"})
    

  } catch (error) {
    return res.status(500).json({errorMsg: error})
  }
}

export async function loginController(req: Request<{}, {}, LoginRequestBody>,res: Response) {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required."
    });
  }

  const user = await authModel.findOne({email});
  if(!user){
    return res.status(400).json({errorMsg: "Invalid Credentials"})
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(400).json({errorMsg: "Invalid Credentials"})
  }

  const accessToken = generateAccessToken( user._id.toString() );
  const refreshToken = generateRefreshToken( user._id.toString() );
  user.refreshToken = refreshToken;
  await user.save();
  return res.status(200).json({
    accessToken,
    refreshToken: refreshToken,
    user: {
      id: user._id,
      email: user.email
    }
  })
  
}

export async function refreshTokenController(req: Request<{}, {}, RefreshRequestBody>, res:Response) {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken){
      return res.status(401).json({errorMsg: "Refresh Token is required."})
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );

    if(typeof decoded === "string" || !("sub" in decoded)){
      return res.status(401).json({errorMsg: "Invalid token"});
    }

    const user = await authModel.findOne({_id: decoded.sub, refreshToken});
    if (!user) {
      return res.status(401).json({
          message: "Invalid refresh token"
      });
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
    return res.status(401).json({errorMsg: "Invalid or expired token."})
  }

  
}
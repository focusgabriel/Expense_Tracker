import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {LoginRequestBody, RegisterRequestBody} from "../types/express/users.types.js"
// import authModel from "../model/users.js"
import { hash } from "node:crypto"
import { authModel } from "../model/index.js"


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
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required."
    });
  }

  const user = await authModel.findOne({email});
  if(!user){
    return res.status(400).json({errorMsg: "Invalid Credentials"})
  }
  const isMatch = bcrypt.compare(password, user.password)
  if(!isMatch){
    return res.status(400).json({errorMsg: "Invalid Credentials"})
  }

  const token = jwt.sign({
      sub: user._id.toString()
    }, 
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d"
    }
  )
  return res.status(200).json({
    message: "Login Successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
  })
}


import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  return jwt.sign({
    sub: userId,
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "15s",
  } 
)
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({
    sub: userId,
  },
  process.env.JWT_REFRESH_SECRET!,
  {
    expiresIn: "2m",
  } 
)
}
// export function generateNewRefreshToken(userId: string) {
//   return jwt.sign({
//     sub: userId,
//   },
//   process.env.JWT_NEWREFRESH_SECRET!,
//   {
//     expiresIn: "7d",
//   } 
// )
// }
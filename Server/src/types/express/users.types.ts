export type RegisterRequestBody = {
  name:string,
  email:string,
  password:string,
  confirm_password:string
}

export type LoginRequestBody = {
  email:string,
  password:string
}

export type RefreshRequestBody = {
  refreshToken: string
}
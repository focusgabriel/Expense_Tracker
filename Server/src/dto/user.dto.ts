export interface userDto {
  name: string,
  email: string,
  password: string,
  verificationToken: string | undefined,
  verificationTokenExpires: Date | undefined
}
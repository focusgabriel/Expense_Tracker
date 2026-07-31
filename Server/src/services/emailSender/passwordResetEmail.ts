import { resend } from "../../config/resend.js";
import resetPasswordTemplate from "./templates/passwordResetTemplate.js";

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your Trackio password",
    html: resetPasswordTemplate(resetLink),
  });
};
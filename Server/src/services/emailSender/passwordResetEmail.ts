import { transporter } from "../../config/mail.js";
import passwordResetTemplate from "./templates/passwordResetTemplate.js";

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string
) => {
  await transporter.sendMail({
    from: `"Trackio" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset your Trackio password",
    html: passwordResetTemplate(resetLink),
  });
};
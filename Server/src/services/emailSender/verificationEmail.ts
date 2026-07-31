import { transporter } from "../../config/mail.js";
import verificationTemplate from "./templates/verificationTemplate.js";

export const sendVerificationEmail = async (
  email: string,
  verificationLink: string
) => {
  await transporter.sendMail({
    from: `"Trackiu" <charlesuchendu750@gmail.com>`,
    to: email,
    subject: "Verify your Trackiu account",
    html: verificationTemplate(verificationLink),
  });
};
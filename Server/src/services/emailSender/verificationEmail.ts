import { resend } from "../../config/resend.js";
import verificationTemplate from "./templates/verificationTemplate.js";

export const sendVerificationEmail = async (
  email: string,
  verificationLink: string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your Trackio account",
    html: verificationTemplate(verificationLink),
  });
};
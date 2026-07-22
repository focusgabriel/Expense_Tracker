import { transporter } from "../utils/sendEmail.js"

interface sendEmailProps {
  to:string,
  subject:string,
  html:string,
}

export const sendEmail = async({to, subject, html}: sendEmailProps) => {
  await transporter.sendMail({
    from: `"Expense Tracker" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  })
}
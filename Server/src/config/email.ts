// import * as Brevo from '@getbrevo/brevo';

// const apiInstance = new Brevo.TransactionalEmailsApi();
// apiInstance.setApiKey(
//   Brevo.TransactionalEmailsApiApiKeys.apiKey,
//   process.env.BREVO_API_KEY
// );

// /**
//  * Sends a transactional email using a verified Brevo sender email.
//  */
// export async function sendEmail({ to, subject, htmlContent, replyToEmail }) {
//   const sendSmtpEmail = new Brevo.SendSmtpEmail();

//   // The sender must be the EXACT email address verified in your Brevo Senders list
//   sendSmtpEmail.sender = {
//     email: process.env.SENDER_EMAIL,
//     name: process.env.SENDER_NAME,
//   };

//   sendSmtpEmail.to = [{ email: to }];
//   sendSmtpEmail.subject = subject;
//   sendSmtpEmail.htmlContent = htmlContent;

//   // Crucial: Route user replies back to your actual email inbox
//   sendSmtpEmail.replyTo = {
//     email: replyToEmail || process.env.SENDER_EMAIL,
//     name: process.env.SENDER_NAME,
//   };

//   try {
//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log('Email sent successfully. MessageID:', response.body.messageId);
//     return response.body;
//   } catch (error) {
//     console.error('Brevo API Error:', error.response?.body || error.message);
//     throw new Error('Failed to send email');
//   }
// }
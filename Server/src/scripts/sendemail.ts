import { sendEmail } from "../services/email.services.js"

const send = () => {
  sendEmail({to:"charlesuchendu750@gmail.com", subject:"Hello form focus", html:"<h1>Noreply</h1>"});
}
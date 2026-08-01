import "dotenv/config";
import { BrevoClient, Brevo } from "@getbrevo/brevo";

console.log(process.env.BREVO_API_KEY)
console.log("mongo uri:",process.env.MONGO_URI)

const apiKey = process.env.BREVO_API_KEY!;

if (!apiKey) {
  console.log("Missing BREVO_API_KEY environment variable");
}

const brevoClient = new BrevoClient({
  apiKey,
});

const apiInstance: {
  sendTransacEmail: (
    request: Brevo.SendTransacEmailRequest
  ) => Promise<Brevo.SendTransacEmailResponse>;
} = {
  sendTransacEmail: (request) =>
    brevoClient.transactionalEmails.sendTransacEmail(request),
};

// export default apiInstance;

async function run() {
  try {
    const info = await apiInstance.sendTransacEmail({
      sender: {
      name: "Trackiu",
      email: "charlesuchendu750@gmail.com",
    },
      to: [{"email":"focusgabriel002@gmail.com"}],
      subject: "SMTP Test",
      htmlContent: "Hello from Brevo!",
    });

    console.log(info);
  } catch (err) {
    console.error("error is actually:", err);
  }
}

run();
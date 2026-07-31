const verificationTemplate = (verificationLink: string) => {
  return `
    <h2>Welcome to Trackio 👋</h2>

    <p>Thank you for creating an account.</p>

    <p>Please verify your email by clicking the button below.</p>

    <a
      href="${verificationLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#4f46e5;
        color:#fff;
        text-decoration:none;
        border-radius:8px;
      "
    >
      Verify Email
    </a>

    <p>If you didn't create this account, ignore this email.</p>
  `;
};

export default verificationTemplate;








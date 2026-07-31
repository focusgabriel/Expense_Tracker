const resetPasswordTemplate = (resetLink: string) => {
  return `
    <h2>Password Reset</h2>

    <p>Click the button below to reset your TracKiu password.</p>

    <a
      href="${resetLink}"
      style="
        display:inline-block;
        padding:12px 20px;
        background:#dc2626;
        color:white;
        text-decoration:none;
        border-radius:8px;
      "
    >
      Reset Password
    </a>

    <p>This link expires shortly.</p>

    <h2>if you didn't request for this reset, that means your account has been compromised, kindly send us a message </h2>
    
  `;
};

export default resetPasswordTemplate;
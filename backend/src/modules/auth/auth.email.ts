import nodemailer from "nodemailer";

// For development, use ethereal email or log to console
const createTransporter = () => {
  // Production: Use real email service
  if (process.env.NODE_ENV === "production" && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Development: Log to console and simulate success
  const devTransporter = {
    sendMail: async (mailOptions: any) => {
      console.log("📧 [DEV MODE] Email would be sent:");
      console.log(`To: ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body: ${mailOptions.html}`);
      return { messageId: "dev-mode-id" };
    },
  };

  return devTransporter as any;
};

const transporter = createTransporter();

export const EmailService = {
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    resetLink: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@healthsync.com",
        to: email,
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}" style="background-color: #4488ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p>Or copy this link: ${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error("Error sending email:", err);
      return false;
    }
  },

  async sendPasswordResetConfirmation(email: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@healthsync.com",
        to: email,
        subject: "Password Reset Successful",
        html: `
          <h2>Password Reset Successful</h2>
          <p>Your password has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error("Error sending email:", err);
      return false;
    }
  },
};

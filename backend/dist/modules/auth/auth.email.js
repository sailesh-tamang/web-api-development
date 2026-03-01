"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// For development, use ethereal email or log to console
const createTransporter = () => {
    // Production: Use real email service
    if (process.env.NODE_ENV === "production" && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        return nodemailer_1.default.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    // Development: Log to console and simulate success
    const devTransporter = {
        sendMail: async (mailOptions) => {
            console.log("📧 [DEV MODE] Email would be sent:");
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Body: ${mailOptions.html}`);
            return { messageId: "dev-mode-id" };
        },
    };
    return devTransporter;
};
const transporter = createTransporter();
exports.EmailService = {
    async sendPasswordResetEmail(email, resetToken, resetLink) {
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
        }
        catch (err) {
            console.error("Error sending email:", err);
            return false;
        }
    },
    async sendPasswordResetConfirmation(email) {
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
        }
        catch (err) {
            console.error("Error sending email:", err);
            return false;
        }
    },
};
//# sourceMappingURL=auth.email.js.map
import crypto from "crypto";
import { AuthRepository } from "./auth.repository";
import bcrypt from "bcryptjs";
import { EmailService } from "./auth.email";

export const PasswordResetService = {
  generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
  },

  getResetTokenExpiry(): Date {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  },

  async requestPasswordReset(email: string, resetLinkBase: string): Promise<{ ok: boolean; message: string; token?: string }> {
    try {
      const user = await AuthRepository.findByEmail(email);
      if (!user) {
        return { ok: false, message: "User not found" };
      }

      const resetToken = this.generateResetToken();
      const resetTokenExpiry = this.getResetTokenExpiry();

      // Hash the token before storing in DB
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      await AuthRepository.updateUser(user._id.toString(), {
        resetToken: hashedToken,
        resetTokenExpiry,
      } as any);

      // Return the plain token to frontend (it will be used immediately)
      return { 
        ok: true, 
        message: "Email verified. You can now reset your password.",
        token: resetToken
      };
    } catch (err) {
      console.error("Error requesting password reset:", err);
      return { ok: false, message: "Server error" };
    }
  },

  async resetPassword(
    token: string,
    email: string,
    newPassword: string
  ): Promise<{ ok: boolean; message: string }> {
    try {
      const user = await AuthRepository.findByEmail(email);
      if (!user) {
        return { ok: false, message: "User not found" };
      }

      // Hash the provided token and compare with stored hash
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      if (user.resetToken !== hashedToken) {
        return { ok: false, message: "Invalid or expired reset token" };
      }

      // Check if token has expired
      if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return { ok: false, message: "Reset token has expired" };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user with new password and clear reset token
      await AuthRepository.updateUser(user._id.toString(), {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      } as any);

      // Send confirmation email
      await EmailService.sendPasswordResetConfirmation(email);

      return { ok: true, message: "Password reset successfully" };
    } catch (err) {
      console.error("Error resetting password:", err);
      return { ok: false, message: "Server error" };
    }
  },

  async validateResetToken(token: string, email: string): Promise<{ ok: boolean; message: string }> {
    try {
      const user = await AuthRepository.findByEmail(email);
      if (!user) {
        return { ok: false, message: "User not found" };
      }

      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      if (user.resetToken !== hashedToken) {
        return { ok: false, message: "Invalid reset token" };
      }

      if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return { ok: false, message: "Reset token has expired" };
      }

      return { ok: true, message: "Token is valid" };
    } catch (err) {
      console.error("Error validating token:", err);
      return { ok: false, message: "Server error" };
    }
  },
};

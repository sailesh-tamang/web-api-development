"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const auth_repository_1 = require("./auth.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_email_1 = require("./auth.email");
exports.PasswordResetService = {
    generateResetToken() {
        return crypto_1.default.randomBytes(32).toString("hex");
    },
    getResetTokenExpiry() {
        return new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    },
    async requestPasswordReset(email, resetLinkBase) {
        try {
            const user = await auth_repository_1.AuthRepository.findByEmail(email);
            if (!user) {
                return { ok: false, message: "User not found" };
            }
            const resetToken = this.generateResetToken();
            const resetTokenExpiry = this.getResetTokenExpiry();
            // Hash the token before storing in DB
            const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
            await auth_repository_1.AuthRepository.updateUser(user._id.toString(), {
                resetToken: hashedToken,
                resetTokenExpiry,
            });
            // Return the plain token to frontend (it will be used immediately)
            return {
                ok: true,
                message: "Email verified. You can now reset your password.",
                token: resetToken
            };
        }
        catch (err) {
            console.error("Error requesting password reset:", err);
            return { ok: false, message: "Server error" };
        }
    },
    async resetPassword(token, email, newPassword) {
        try {
            const user = await auth_repository_1.AuthRepository.findByEmail(email);
            if (!user) {
                return { ok: false, message: "User not found" };
            }
            // Hash the provided token and compare with stored hash
            const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
            if (user.resetToken !== hashedToken) {
                return { ok: false, message: "Invalid or expired reset token" };
            }
            // Check if token has expired
            if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
                return { ok: false, message: "Reset token has expired" };
            }
            // Hash the new password
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            // Update user with new password and clear reset token
            await auth_repository_1.AuthRepository.updateUser(user._id.toString(), {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            });
            // Send confirmation email
            await auth_email_1.EmailService.sendPasswordResetConfirmation(email);
            return { ok: true, message: "Password reset successfully" };
        }
        catch (err) {
            console.error("Error resetting password:", err);
            return { ok: false, message: "Server error" };
        }
    },
    async validateResetToken(token, email) {
        try {
            const user = await auth_repository_1.AuthRepository.findByEmail(email);
            if (!user) {
                return { ok: false, message: "User not found" };
            }
            const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
            if (user.resetToken !== hashedToken) {
                return { ok: false, message: "Invalid reset token" };
            }
            if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
                return { ok: false, message: "Reset token has expired" };
            }
            return { ok: true, message: "Token is valid" };
        }
        catch (err) {
            console.error("Error validating token:", err);
            return { ok: false, message: "Server error" };
        }
    },
};
//# sourceMappingURL=password-reset.service.js.map
export declare const PasswordResetService: {
    generateResetToken(): string;
    getResetTokenExpiry(): Date;
    requestPasswordReset(email: string, resetLinkBase: string): Promise<{
        ok: boolean;
        message: string;
        token?: string;
    }>;
    resetPassword(token: string, email: string, newPassword: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    validateResetToken(token: string, email: string): Promise<{
        ok: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=password-reset.service.d.ts.map
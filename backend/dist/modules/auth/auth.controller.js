"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const password_reset_service_1 = require("./password-reset.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("./auth.repository");
exports.AuthController = {
    async register(req, res) {
        const parsed = auth_dto_1.registerDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.register(parsed.data);
        return res.status(result.status).json(result);
    },
    async login(req, res) {
        const parsed = auth_dto_1.loginDto.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }
        const result = await auth_service_1.AuthService.login(parsed.data);
        return res.status(result.status).json(result);
    },
    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ ok: false, message: "Missing fields" });
            }
            const existing = await auth_repository_1.AuthRepository.findByEmail(email);
            if (existing)
                return res.status(409).json({ ok: false, message: "Email exists" });
            const hashed = await bcryptjs_1.default.hash(password, 10);
            const image = req.file ? req.file.filename : undefined;
            const user = await auth_repository_1.AuthRepository.createUser({
                name,
                email,
                password: hashed,
                role: role || "user",
                ...(image ? { image } : {}),
            });
            return res.status(201).json({ ok: true, message: "User created", user: { id: user._id, email: user.email, role: user.role } });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await auth_repository_1.AuthRepository.findById(id);
            if (!user)
                return res.status(404).json({ ok: false, message: "User not found" });
            return res.status(200).json({ ok: true, user });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (page < 1 || limit < 1) {
                return res.status(400).json({ ok: false, message: "Invalid pagination parameters" });
            }
            const result = await auth_repository_1.AuthRepository.findAllWithPagination({ page, limit });
            return res.status(200).json({ ok: true, ...result });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;
            if (req.file) {
                body.image = req.file.filename;
            }
            if (body.password) {
                body.password = await bcryptjs_1.default.hash(body.password, 10);
            }
            const updated = await auth_repository_1.AuthRepository.updateUser(id, body);
            if (!updated)
                return res.status(404).json({ ok: false, message: "User not found" });
            return res.status(200).json({ ok: true, user: updated });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ ok: false, message: "Email is required" });
            }
            const resetLinkBase = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`;
            const result = await password_reset_service_1.PasswordResetService.requestPasswordReset(email, resetLinkBase);
            if (!result.ok) {
                return res.status(400).json(result);
            }
            return res.status(200).json({
                ok: true,
                message: result.message,
                token: result.token,
                email: email
            });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async resetPassword(req, res) {
        try {
            const { token, email, newPassword, confirmPassword } = req.body;
            if (!token || !email || !newPassword || !confirmPassword) {
                return res.status(400).json({ ok: false, message: "Missing required fields" });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ ok: false, message: "Passwords do not match" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ ok: false, message: "Password must be at least 6 characters" });
            }
            const result = await password_reset_service_1.PasswordResetService.resetPassword(token, email, newPassword);
            return res.status(result.ok ? 200 : 400).json(result);
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async validateResetToken(req, res) {
        try {
            const { token, email } = req.body;
            if (!token || !email) {
                return res.status(400).json({ ok: false, message: "Token and email are required" });
            }
            const result = await password_reset_service_1.PasswordResetService.validateResetToken(token, email);
            return res.status(result.ok ? 200 : 400).json(result);
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await auth_repository_1.AuthRepository.deleteUser(id);
            if (!deleted) {
                return res.status(404).json({ ok: false, message: "User not found" });
            }
            return res.status(200).json({ ok: true, message: "User deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map
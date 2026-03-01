"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("./auth.repository");
exports.AuthService = {
    async register(data) {
        const existing = await auth_repository_1.AuthRepository.findByEmail(data.email);
        if (existing) {
            return { ok: false, status: 409, message: "Email already exists" };
        }
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = await auth_repository_1.AuthRepository.createUser({
            name: data.name,
            email: data.email,
            password: hashed,
            role: "user",
        });
        return {
            ok: true,
            status: 201,
            message: "User registered successfully",
            user: { id: user._id, email: user.email, role: user.role },
        };
    },
    async login(data) {
        const user = await auth_repository_1.AuthRepository.findByEmail(data.email);
        if (!user) {
            return { ok: false, status: 404, message: "User not found" };
        }
        const match = await bcryptjs_1.default.compare(data.password, user.password);
        if (!match) {
            return { ok: false, status: 401, message: "Invalid credentials" };
        }
        const secret = process.env.JWT_SECRET || "change_me_local_secret";
        const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
        const token = jsonwebtoken_1.default.sign({ sub: user._id.toString(), email: user.email, role: user.role }, secret, { expiresIn });
        return {
            ok: true,
            status: 200,
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, role: user.role },
        };
    },
};
//# sourceMappingURL=auth.service.js.map
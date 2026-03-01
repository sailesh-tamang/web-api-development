"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const token = auth.split(" ")[1];
    try {
        const secret = (process.env.JWT_SECRET || "change_me_local_secret");
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const userId = payload.sub || payload.id;
        if (!userId) {
            return res.status(401).json({ ok: false, message: "Invalid token payload" });
        }
        req.user = {
            id: userId,
            ...(payload.email ? { email: payload.email } : {}),
            ...(payload.role ? { role: payload.role } : {}),
        };
        next();
    }
    catch (_error) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
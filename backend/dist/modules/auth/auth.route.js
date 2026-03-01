"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const admin_middleware_1 = require("../../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login", auth_controller_1.AuthController.login);
// Password reset routes
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
router.post("/validate-reset-token", auth_controller_1.AuthController.validateResetToken);
// Get all users (with pagination)
router.get("/", auth_controller_1.AuthController.getAllUsers);
// Create user via FormData (used by admin frontend creation form)
router.post("/user", (0, upload_middleware_1.default)("image"), auth_controller_1.AuthController.createUser);
// Update user (allow image upload)
router.put("/:id", (0, upload_middleware_1.default)("image"), auth_controller_1.AuthController.updateUser);
// Delete user (admin only)
router.delete("/:id", admin_middleware_1.adminOnly, auth_controller_1.AuthController.deleteUser);
// Get user by id (for profile fetching)
router.get("/:id", auth_controller_1.AuthController.getUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map
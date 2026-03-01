"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed password
    image: { type: String },
    age: { type: Number },
    height: { type: Number }, // in feet
    weight: { type: Number }, // in kg
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map
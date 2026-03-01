"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./modules/user/user.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
async function createAdmin() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("Connected to DB");
        const existing = await user_model_1.UserModel.findOne({ email: "admin@example.com" });
        if (existing) {
            console.log("Admin already exists");
            return;
        }
        const hashed = await bcryptjs_1.default.hash("admin123", 10);
        const admin = new user_model_1.UserModel({
            name: "Admin",
            email: "admin@example.com",
            password: hashed,
            role: "admin",
        });
        await admin.save();
        console.log("Admin created: email: admin@example.com, password: admin123");
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        mongoose_1.default.disconnect();
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map
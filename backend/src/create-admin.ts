import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "./modules/user/user.model";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const existing = await UserModel.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const hashed = await bcrypt.hash("admin123", 10);
    const admin = new UserModel({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    });

    await admin.save();
    console.log("Admin created: email: admin@example.com, password: admin123");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
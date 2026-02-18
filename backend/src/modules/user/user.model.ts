import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed password
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);

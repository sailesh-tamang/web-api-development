import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import adminRoutes from "./modules/admin/admin.route";
import path from "path";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));

app.get("/", (_req, res) => res.json({ message: "EverBlue API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

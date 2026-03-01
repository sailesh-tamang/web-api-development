import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import adminRoutes from "./modules/admin/admin.route";
import workoutRoutes from "./modules/workout/workout.route";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));

app.get("/", (_req, res) => res.json({ message: "EverBlue API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/workout", workoutRoutes);

export default app;

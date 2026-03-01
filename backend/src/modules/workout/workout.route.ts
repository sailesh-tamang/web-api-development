import express from "express";
import {
  startWorkout,
  endWorkout,
  getWorkoutHistory,
  getWorkoutStats,
  deleteWorkout,
  getTodayProgress,
} from "./workout.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

// Start a new workout
router.post("/start", startWorkout);

// End/complete a workout
router.put("/:workoutId/end", endWorkout);

// Get workout history/reports
router.get("/history", getWorkoutHistory);

// Get workout statistics
router.get("/stats", getWorkoutStats);

// Get today's progress
router.get("/today", getTodayProgress);

// Delete a workout
router.delete("/:workoutId", deleteWorkout);

export default router;

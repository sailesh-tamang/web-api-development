"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workout_controller_1 = require("./workout.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
// Start a new workout
router.post("/start", workout_controller_1.startWorkout);
// End/complete a workout
router.put("/:workoutId/end", workout_controller_1.endWorkout);
// Get workout history/reports
router.get("/history", workout_controller_1.getWorkoutHistory);
// Get workout statistics
router.get("/stats", workout_controller_1.getWorkoutStats);
// Get today's progress
router.get("/today", workout_controller_1.getTodayProgress);
// Delete a workout
router.delete("/:workoutId", workout_controller_1.deleteWorkout);
exports.default = router;
//# sourceMappingURL=workout.route.js.map
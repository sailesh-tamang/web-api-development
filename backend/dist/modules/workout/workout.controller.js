"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayProgress = exports.deleteWorkout = exports.getWorkoutStats = exports.getWorkoutHistory = exports.endWorkout = exports.startWorkout = void 0;
const workout_model_1 = require("./workout.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Start a new workout
const startWorkout = async (req, res) => {
    try {
        const { workoutName, description, estimatedDuration, caloriesBurned, difficulty } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!workoutName || !estimatedDuration || !caloriesBurned) {
            return res.status(400).json({
                message: "Missing required fields: workoutName, estimatedDuration, caloriesBurned",
            });
        }
        // Check if user has already started the SAME workout type today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const existingSameWorkoutToday = await workout_model_1.WorkoutModel.findOne({
            userId,
            workoutName, // Check for the SAME workout name
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });
        if (existingSameWorkoutToday) {
            return res.status(400).json({
                message: `You have already started ${workoutName} today. You can do this workout again after 24 hours.`,
                nextAvailableTime: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            });
        }
        const workout = await workout_model_1.WorkoutModel.create({
            userId,
            workoutName,
            description,
            duration: estimatedDuration,
            caloriesBurned,
            difficulty: difficulty || "Moderate",
            status: "in-progress",
        });
        return res.status(201).json({
            message: "Workout started successfully",
            data: workout,
        });
    }
    catch (error) {
        console.error("Start workout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.startWorkout = startWorkout;
// End/Complete a workout
const endWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        const { actualDuration, actualCalories, notes } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!workoutId || !mongoose_1.default.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).json({ message: "Invalid workout ID" });
        }
        const workout = await workout_model_1.WorkoutModel.findById(workoutId);
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        if (workout.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to update this workout" });
        }
        const updatedWorkout = await workout_model_1.WorkoutModel.findByIdAndUpdate(workoutId, {
            duration: actualDuration || workout.duration,
            caloriesBurned: actualCalories || workout.caloriesBurned,
            endTime: new Date(),
            status: "completed",
            notes,
        }, { new: true });
        return res.status(200).json({
            message: "Workout completed successfully",
            data: updatedWorkout,
        });
    }
    catch (error) {
        console.error("End workout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.endWorkout = endWorkout;
// Get all workouts for a user (reports)
const getWorkoutHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { startDate, endDate, limit = 10, skip = 0 } = req.query;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const query = { userId };
        // Filter by date range if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        const workouts = await workout_model_1.WorkoutModel.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));
        const total = await workout_model_1.WorkoutModel.countDocuments(query);
        return res.status(200).json({
            message: "Workouts retrieved successfully",
            data: workouts,
            total,
        });
    }
    catch (error) {
        console.error("Get workout history error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getWorkoutHistory = getWorkoutHistory;
// Get workout statistics
const getWorkoutStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }
        const stats = await workout_model_1.WorkoutModel.aggregate([
            { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalDuration: { $sum: "$duration" },
                    totalCalories: { $sum: "$caloriesBurned" },
                    completedWorkouts: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                    },
                },
            },
        ]);
        const workoutStats = stats[0] || {
            totalWorkouts: 0,
            totalDuration: 0,
            totalCalories: 0,
            completedWorkouts: 0,
        };
        return res.status(200).json({
            message: "Statistics retrieved successfully",
            data: workoutStats,
        });
    }
    catch (error) {
        console.error("Get stats error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getWorkoutStats = getWorkoutStats;
// Delete a workout
const deleteWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!workoutId || !mongoose_1.default.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).json({ message: "Invalid workout ID" });
        }
        const workout = await workout_model_1.WorkoutModel.findById(workoutId);
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        if (workout.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this workout" });
        }
        await workout_model_1.WorkoutModel.findByIdAndDelete(workoutId);
        return res.status(200).json({
            message: "Workout deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete workout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteWorkout = deleteWorkout;
// Get today's progress stats (completed workouts only)
const getTodayProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }
        // Get start and end of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        // Get completed workouts for today
        const todayWorkouts = await workout_model_1.WorkoutModel.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            status: "completed",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });
        // Calculate totals
        const totalWorkouts = todayWorkouts.length;
        const totalDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
        const totalCalories = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        // Calculate estimated distance (rough estimate: 1 min of cardio = ~0.08 km)
        const totalDistance = (totalDuration * 0.08).toFixed(1);
        return res.status(200).json({
            message: "Today's progress retrieved successfully",
            data: {
                totalWorkouts,
                totalDuration,
                totalCalories,
                totalDistance: parseFloat(totalDistance),
                workouts: todayWorkouts,
            },
        });
    }
    catch (error) {
        console.error("Get today progress error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTodayProgress = getTodayProgress;
//# sourceMappingURL=workout.controller.js.map
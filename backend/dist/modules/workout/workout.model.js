"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const workoutSessionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    workoutName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    caloriesBurned: {
        type: Number,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Moderate", "Hard", "Very Hard"],
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["in-progress", "completed", "cancelled"],
        default: "in-progress",
    },
    notes: {
        type: String,
    },
}, { timestamps: true });
exports.WorkoutModel = mongoose_1.default.model("Workout", workoutSessionSchema);
//# sourceMappingURL=workout.model.js.map
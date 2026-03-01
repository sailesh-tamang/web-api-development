import mongoose from "mongoose";

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const WorkoutModel = mongoose.model("Workout", workoutSessionSchema);

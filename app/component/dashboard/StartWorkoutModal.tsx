"use client";

import { useState } from "react";
import { workoutService, WorkoutData } from "@/app/lib/workoutService";

interface StartWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

const workoutTemplates = [
  {
    name: "Morning Run",
    duration: 32,
    calories: 285,
    difficulty: "Moderate",
    description: "5K outdoor run with warm-up and cool-down",
  },
  {
    name: "Strength Training",
    duration: 48,
    calories: 420,
    difficulty: "Hard",
    description: "Full-body workout focusing on compound movements",
  },
  {
    name: "Yoga Flow",
    duration: 45,
    calories: 180,
    difficulty: "Easy",
    description: "Relaxing vinyasa flow to improve flexibility",
  },
  {
    name: "HIIT Cardio",
    duration: 25,
    calories: 380,
    difficulty: "Very Hard",
    description: "High-intensity interval training session",
  },
  {
    name: "Swimming",
    duration: 40,
    calories: 350,
    difficulty: "Hard",
    description: "Full-body swimming workout",
  },
];

export default function StartWorkoutModal({
  isOpen,
  onClose,
  onWorkoutStarted,
}: StartWorkoutModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof workoutTemplates)[0] | null>(null);
  const [customWorkout, setCustomWorkout] = useState({
    workoutName: "",
    description: "",
    estimatedDuration: 30,
    caloriesBurned: 200,
    difficulty: "Moderate" as const,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const handleSelectTemplate = (template: (typeof workoutTemplates)[0]) => {
    setSelectedTemplate(template);
  };

  const handleStartWorkout = async () => {
    try {
      setIsLoading(true);
      setError("");

      const workoutData: WorkoutData = useCustom
        ? customWorkout
        : {
            workoutName: selectedTemplate?.name || "",
            description: selectedTemplate?.description,
            estimatedDuration: selectedTemplate?.duration || 30,
            caloriesBurned: selectedTemplate?.calories || 200,
            difficulty: selectedTemplate?.difficulty as any || "Moderate",
          };

      if (!workoutData.workoutName) {
        setError("Please select a workout or enter a custom workout name");
        return;
      }

      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("Please login first to start a workout");
        return;
      }

      const response = await workoutService.startWorkout(workoutData, token);
      
      if (response.data && response.data._id) {
        onWorkoutStarted();
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to start workout";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Start a Workout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-semibold mb-1">Exercise Already Done Today</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs mt-2 text-red-200">Try a different exercise or come back tomorrow!</p>
                </div>
              </div>
            </div>
          )}

          {/* Toggle between templates and custom */}
          <div className="flex gap-4">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !useCustom
                  ? "bg-[#A3E635] text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Select Workout
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                useCustom
                  ? "bg-[#A3E635] text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Custom Workout
            </button>
          </div>

          {!useCustom ? (
            // Template Selection
            <div className="space-y-3">
              <p className="text-gray-300">Choose from popular workouts:</p>
              <div className="grid grid-cols-1 gap-3">
                {workoutTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      selectedTemplate?.name === template.name
                        ? "border-[#A3E635] bg-[#A3E635]/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#A3E635] font-semibold">{template.duration} min</p>
                        <p className="text-xs text-gray-400">{template.calories} kcal</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Custom Workout
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Workout Name</label>
                <input
                  type="text"
                  value={customWorkout.workoutName}
                  onChange={(e) =>
                    setCustomWorkout({ ...customWorkout, workoutName: e.target.value })
                  }
                  placeholder="e.g., Boxing Session"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#A3E635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={customWorkout.description}
                  onChange={(e) =>
                    setCustomWorkout({ ...customWorkout, description: e.target.value })
                  }
                  placeholder="What are you planning to do?"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#A3E635] focus:outline-none resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={customWorkout.estimatedDuration}
                    onChange={(e) =>
                      setCustomWorkout({
                        ...customWorkout,
                        estimatedDuration: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#A3E635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Calories</label>
                  <input
                    type="number"
                    value={customWorkout.caloriesBurned}
                    onChange={(e) =>
                      setCustomWorkout({
                        ...customWorkout,
                        caloriesBurned: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#A3E635] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Difficulty</label>
                  <select
                    value={customWorkout.difficulty}
                    onChange={(e) =>
                      setCustomWorkout({
                        ...customWorkout,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#A3E635] focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Very Hard">Very Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStartWorkout}
            disabled={isLoading || (!useCustom && !selectedTemplate) || (useCustom && !customWorkout.workoutName)}
            className="flex-1 px-6 py-3 bg-[#A3E635] text-black font-semibold rounded-lg hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting..." : "Start Workout"}
          </button>
        </div>
      </div>
    </div>
  );
}

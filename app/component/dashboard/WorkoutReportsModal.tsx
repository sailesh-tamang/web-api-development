"use client";

import { useState, useEffect } from "react";
import { workoutService } from "@/app/lib/workoutService";

interface WorkoutReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshKey?: number;
  onWorkoutCompleted?: () => void;
}

export default function WorkoutReportsModal({ isOpen, onClose, refreshKey = 0, onWorkoutCompleted }: WorkoutReportsModalProps) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, refreshKey]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token") || "";

      // Fetch history and stats in parallel
      const [historyResponse, statsResponse] = await Promise.all([
        workoutService.getWorkoutHistory({ limit: 20 }, token),
        workoutService.getWorkoutStats(token),
      ]);

      setWorkouts(historyResponse.data || []);
      setStats(statsResponse.data);
    } catch (err: any) {
      setError(err.message || "Failed to load workout data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("Please login to complete workouts");
        return;
      }

      // Mark workout as complete
      await workoutService.endWorkout(workoutId, {}, token);
      
      // Refresh data to show updated stats and status
      await loadData();
      
      // Notify parent (Dashboard) to refresh today's progress
      if (onWorkoutCompleted) {
        onWorkoutCompleted();
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete workout");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Workout Reports</h2>
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
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-400">Loading your workout data...</div>
            </div>
          ) : (
            <>
              {/* Statistics */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-[#A3E635]/20 to-[#A3E635]/5 border border-[#A3E635]/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Workouts</p>
                    <p className="text-2xl font-bold text-[#A3E635]">{stats.totalWorkouts || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Duration</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatTime(stats.totalDuration || 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Calories Burned</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {stats.totalCalories || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Completed</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {stats.completedWorkouts || 0}
                    </p>
                  </div>
                </div>
              )}

              {/* Workout History */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Recent Workouts</h3>

                {workouts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No workouts yet. Start by clicking "Start Workout"!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workouts.map((workout) => (
                      <div
                        key={workout._id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition group relative"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{workout.workoutName}</h4>
                            <p className="text-gray-400 text-sm">{workout.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {workout.status === "in-progress" && (
                              <button
                                onClick={() => handleCompleteWorkout(workout._id)}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 rounded-full text-xs font-semibold transition border border-green-500/30 hover:border-green-500/50"
                                title="Click to mark as complete"
                              >
                                Mark Complete
                              </button>
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                workout.status === "completed"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : workout.status === "in-progress"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              }`}
                            >
                              {workout.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="text-white font-semibold">{formatTime(workout.duration)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Calories</p>
                            <p className="text-white font-semibold">{workout.caloriesBurned} kcal</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Difficulty</p>
                            <p className="text-white font-semibold">{workout.difficulty}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Date</p>
                            <p className="text-white font-semibold">
                              {formatDate(workout.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#A3E635] text-black font-semibold rounded-lg hover:bg-green-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

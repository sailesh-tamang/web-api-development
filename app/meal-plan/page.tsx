'use client';

import { useState } from "react";
import TopBar from "../component/dashboard/TopBar";

export default function MealPlanPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // YouTube meal plan video IDs
  const mealVideos = {
    weightLoss: {
      id: "LCyECbA3pUw",
      title: "Weight Loss Meal Plan"
    },
    maintenance: {
      id: "81G22t2UHxA",
      title: "Maintenance Meal Plan"
    },
    muscleGain: {
      id: "6y-R3dNx4vA",
      title: "Muscle Gain Meal Plan"
    },
  };

  const handleVideoClick = (videoId: string, title: string) => {
    setSelectedVideo(videoId);
    setSelectedTitle(title);
  };
  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
            <div className="mx-auto w-fit rounded-full bg-lime-400 px-6 py-2 text-center text-sm font-semibold text-black">
              Meal Plan
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Nutrition
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Balance
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Hydration
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Recovery
              </span>
            </div>

            <p className="mt-5 text-base font-semibold italic text-slate-200">
              Build a plan that fuels your day: steady energy, clean ingredients,
              and consistent habits that support your fitness goal.
            </p>

            {/* Video Player */}
            {selectedVideo && (
              <div className="mt-8 rounded-xl border border-lime-400/30 bg-black/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-lime-400">{selectedTitle}</h3>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo}`}
                    title={selectedTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-4">
              <button
                onClick={() => handleVideoClick(mealVideos.weightLoss.id, mealVideos.weightLoss.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Weight Loss
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  High protein, lower sugar, and portion control
                </p>
              </button>

              <button
                onClick={() => handleVideoClick(mealVideos.maintenance.id, mealVideos.maintenance.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Maintenance
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Balanced calories with whole foods
                </p>
              </button>

              <button
                onClick={() => handleVideoClick(mealVideos.muscleGain.id, mealVideos.muscleGain.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Muscle Gain
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Calorie surplus with protein each meal
                </p>
              </button>
            </div>

            
          </div>
        </div>
      </main>
    </div>
  );
}

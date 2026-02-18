'use client';

import { useState } from "react";
import TopBar from "../component/dashboard/TopBar";

export default function ExerciseTipsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // YouTube video IDs extracted from your links
  const exerciseVideos = {
    generalHealth: {
      id: "8ef7FhmMcLU",
      title: "General Health Exercises"
    },
    weightLoss: {
      id: "Ammb_7sv_KA",
      title: "Weight Loss Exercises"
    },
    muscleGain: {
      id: "UIPvIYsjfpo",
      title: "Muscle Gain Exercises"
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
              Exercise Tips
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <span className="rounded-full border border-white/15 px-3 py-1">
                Fitness Goal
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Strength
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Training
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                Cardio
              </span>
            </div>

            <p className="mt-5 text-base font-semibold italic text-slate-200">
              According to this, you can plan your workout by knowing your goal
              and what else you can do.
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
                onClick={() => handleVideoClick(exerciseVideos.generalHealth.id, exerciseVideos.generalHealth.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  General Health
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  2 days/week, 150 mins moderate activity
                </p>
              </button>

              <button 
                onClick={() => handleVideoClick(exerciseVideos.weightLoss.id, exerciseVideos.weightLoss.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Weight Loss
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  3 days/week, mix of HIIT &amp; steady state
                </p>
              </button>

              <button 
                onClick={() => handleVideoClick(exerciseVideos.muscleGain.id, exerciseVideos.muscleGain.title)}
                className="rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-all hover:border-lime-400/50 hover:bg-black/60 hover:shadow-lg hover:shadow-lime-400/10 active:scale-95"
              >
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Muscle Gain
                  <span className="text-xs text-lime-400">▶ Watch Video</span>
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  4–5 days/week, light activity (walking)
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
